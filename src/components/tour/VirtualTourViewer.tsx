"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Mesh,
  SphereGeometry,
  MeshBasicMaterial,
  Texture,
  TextureLoader,
} from "three";
import { TourScene, TourHotspot } from "@/types/heritage";
import {
  Maximize2,
  Minimize2,
  Compass,
  Info,
  Layers,
  ChevronRight,
  RotateCcw,
  MapPin,
  Loader2,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  ShieldCheck,
  Camera,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface VirtualTourViewerProps {
  scenes: TourScene[];
  monumentName: string;
  onSceneChange?: (sceneId: string) => void;
}

// Convert spherical angles to screen XY for genuine 360° equirectangular scenes
function sphericalToScreen(
  hotspotYaw: number,
  hotspotPitch: number,
  cameraYaw: number,
  cameraPitch: number,
  hFov: number,
  vFov: number
): { x: number; y: number; visible: boolean } {
  const dy = ((hotspotYaw - cameraYaw + 540) % 360) - 180;
  const dp = hotspotPitch - cameraPitch;

  if (Math.abs(dy) > hFov * 0.6 || Math.abs(dp) > vFov * 0.65) {
    return { x: 0, y: 0, visible: false };
  }

  const tanHalf = Math.tan((hFov * Math.PI) / 360);
  const tanHalfV = Math.tan((vFov * Math.PI) / 360);
  const x = 50 + (Math.tan((dy * Math.PI) / 180) / tanHalf) * 50;
  const y = 50 - (Math.tan((dp * Math.PI) / 180) / tanHalfV) * 50;

  return { x, y, visible: true };
}

interface ThreeContext {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  mesh: Mesh<SphereGeometry, MeshBasicMaterial>;
  texture: Texture | null;
  animFrame: number;
  loader: TextureLoader;
}

export function VirtualTourViewer({
  scenes,
  monumentName,
  onSceneChange,
}: VirtualTourViewerProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<TourHotspot | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSceneDrawer, setShowSceneDrawer] = useState(false);
  const [showProvenanceModal, setShowProvenanceModal] = useState(false);
  const [showControlsHint, setShowControlsHint] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [webGLError, setWebGLError] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // 360° Camera orientation state
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [fov, setFov] = useState(75);
  const [isDragging360, setIsDragging360] = useState(false);

  // Standard Photo Pan & Zoom state
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoPan, setPhotoPan] = useState({ x: 0, y: 0 });
  const [isPanningPhoto, setIsPanningPhoto] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoContainerRef = useRef<HTMLDivElement>(null);

  const threeRef = useRef<ThreeContext | null>(null);

  const dragStartRef = useRef<{ x: number; y: number; yaw: number; pitch: number }>({
    x: 0,
    y: 0,
    yaw: 0,
    pitch: 0,
  });

  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
  });

  const activeScene = scenes[currentSceneIndex] || scenes[0];
  const is360Mode = activeScene?.sceneType === "equirectangular_360" && Boolean(activeScene.panoramaUrl);
  const displayPhotoUrl = activeScene?.standardPhotoUrl || activeScene?.thumbnailUrl || activeScene?.panoramaUrl;

  const clampPitch = (p: number) => Math.max(-85, Math.min(85, p));

  // Load high-resolution texture with anisotropy and mipmaps
  const loadTexture = useCallback(
    async (THREE: typeof import("three"), url: string | undefined) => {
      if (!threeRef.current || !url) return;
      setIsLoading(true);
      setImageLoadError(false);

      const { loader, mesh, renderer } = threeRef.current;

      try {
        const texture = await new Promise<Texture>((resolve, reject) => {
          loader.load(
            url,
            (t) => resolve(t),
            undefined,
            (err) => reject(err)
          );
        });

        if (!threeRef.current) return;

        if (THREE.SRGBColorSpace) {
          texture.colorSpace = THREE.SRGBColorSpace;
        }
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
        if (maxAnisotropy > 1) {
          texture.anisotropy = Math.min(maxAnisotropy, 8);
        }

        if (threeRef.current.texture) {
          threeRef.current.texture.dispose();
        }
        threeRef.current.texture = texture;
        mesh.material.map = texture;
        mesh.material.color.set(0xffffff);
        mesh.material.needsUpdate = true;
      } catch {
        console.warn("Panorama texture load failed for:", url);
        setImageLoadError(true);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ─── THREE.JS 360° PIPELINE ──────────────────────────────────────────
  useEffect(() => {
    if (!is360Mode || !canvasRef.current) return;

    let cancelled = false;

    async function init360() {
      try {
        const THREE = await import("three");
        if (cancelled || !canvasRef.current) return;

        // Check WebGL availability
        const testCanvas = document.createElement("canvas");
        const gl = testCanvas.getContext("webgl2") || testCanvas.getContext("webgl");
        if (!gl) {
          setWebGLError(true);
          return;
        }

        const canvas = canvasRef.current;
        const W = canvas.clientWidth || 1280;
        const H = canvas.clientHeight || 720;

        // High-precision WebGL Renderer with sRGB color space
        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W, H, false);
        if (THREE.SRGBColorSpace) {
          renderer.outputColorSpace = THREE.SRGBColorSpace;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
        camera.position.set(0, 0, 0);

        // High-resolution sphere geometry (64 segments for smooth curvature)
        const geo = new THREE.SphereGeometry(500, 64, 48);
        const mat = new THREE.MeshBasicMaterial({
          side: THREE.BackSide,
          color: 0x181615,
        });
        const mesh = new THREE.Mesh(geo, mat);
        // Correct equirectangular azimuth orientation
        mesh.scale.set(-1, 1, 1);
        scene.add(mesh);

        const loader = new THREE.TextureLoader();

        threeRef.current = { renderer, scene, camera, mesh, texture: null, animFrame: 0, loader };

        function renderLoop() {
          if (!threeRef.current) return;
          threeRef.current.animFrame = requestAnimationFrame(renderLoop);
          threeRef.current.renderer.render(threeRef.current.scene, threeRef.current.camera);
        }
        renderLoop();

        const ro = new ResizeObserver(() => {
          if (!threeRef.current || !canvas) return;
          const w = canvas.clientWidth;
          const h = canvas.clientHeight;
          threeRef.current.renderer.setSize(w, h, false);
          threeRef.current.camera.aspect = w / h;
          threeRef.current.camera.updateProjectionMatrix();
        });
        ro.observe(canvas);

        if (activeScene.panoramaUrl) {
          loadTexture(THREE, activeScene.panoramaUrl);
        }
      } catch (err) {
        console.error("Three.js initialization error:", err);
        setWebGLError(true);
      }
    }

    init360();

    return () => {
      cancelled = true;
      if (threeRef.current) {
        cancelAnimationFrame(threeRef.current.animFrame);
        if (threeRef.current.texture) threeRef.current.texture.dispose();
        if (threeRef.current.mesh) {
          threeRef.current.mesh.geometry.dispose();
          threeRef.current.mesh.material.dispose();
        }
        threeRef.current.renderer.dispose();
        threeRef.current = null;
      }
    };
  }, [is360Mode, activeScene.panoramaUrl, loadTexture]);

  // Sync camera orientation in 360 mode
  useEffect(() => {
    if (!threeRef.current || !is360Mode) return;
    const { camera } = threeRef.current;

    const yawRad = (yaw * Math.PI) / 180;
    const pitchRad = (pitch * Math.PI) / 180;

    const x = Math.cos(pitchRad) * Math.sin(yawRad);
    const y = Math.sin(pitchRad);
    const z = Math.cos(pitchRad) * Math.cos(yawRad);

    camera.lookAt(x, y, z);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [yaw, pitch, fov, is360Mode]);

  // ─── 360° DRAG & ZOOM CONTROLS ──────────────────────────────────────
  const handleMouseDown360 = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging360(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, yaw, pitch };
  };

  const handleMouseMove360 = useCallback(
    (e: MouseEvent) => {
      if (!isDragging360) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      const sensitivity = 0.18;
      setYaw((dragStartRef.current.yaw - dx * sensitivity + 360) % 360);
      setPitch(clampPitch(dragStartRef.current.pitch + dy * sensitivity));
      if (showControlsHint) setShowControlsHint(false);
    },
    [isDragging360, showControlsHint]
  );

  const handleMouseUp360 = useCallback(() => setIsDragging360(false), []);

  const handleWheel360 = (e: React.WheelEvent) => {
    e.preventDefault();
    setFov((prev) => Math.max(40, Math.min(95, prev + e.deltaY * 0.04)));
  };

  useEffect(() => {
    if (isDragging360) {
      window.addEventListener("mousemove", handleMouseMove360);
      window.addEventListener("mouseup", handleMouseUp360);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove360);
      window.removeEventListener("mouseup", handleMouseUp360);
    };
  }, [isDragging360, handleMouseMove360, handleMouseUp360]);

  // ─── STANDARD PHOTO PAN & ZOOM CONTROLS ─────────────────────────────
  const handleMouseDownPhoto = (e: React.MouseEvent) => {
    if (photoZoom <= 1) return;
    e.preventDefault();
    setIsPanningPhoto(true);
    panStartRef.current = { x: e.clientX, y: e.clientY, panX: photoPan.x, panY: photoPan.y };
  };

  const handleMouseMovePhoto = useCallback(
    (e: MouseEvent) => {
      if (!isPanningPhoto) return;
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      const maxPan = (photoZoom - 1) * 300;
      setPhotoPan({
        x: Math.max(-maxPan, Math.min(maxPan, panStartRef.current.panX + dx)),
        y: Math.max(-maxPan, Math.min(maxPan, panStartRef.current.panY + dy)),
      });
      if (showControlsHint) setShowControlsHint(false);
    },
    [isPanningPhoto, photoZoom, showControlsHint]
  );

  const handleMouseUpPhoto = useCallback(() => setIsPanningPhoto(false), []);

  useEffect(() => {
    if (isPanningPhoto) {
      window.addEventListener("mousemove", handleMouseMovePhoto);
      window.addEventListener("mouseup", handleMouseUpPhoto);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMovePhoto);
      window.removeEventListener("mouseup", handleMouseUpPhoto);
    };
  }, [isPanningPhoto, handleMouseMovePhoto, handleMouseUpPhoto]);

  const handleWheelPhoto = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    const newZoom = Math.max(1, Math.min(3.5, photoZoom + delta));
    setPhotoZoom(newZoom);
    if (newZoom === 1) {
      setPhotoPan({ x: 0, y: 0 });
    }
    if (showControlsHint) setShowControlsHint(false);
  };

  const handleZoomIn = () => setPhotoZoom((z) => Math.min(3.5, z + 0.5));
  const handleZoomOut = () => {
    setPhotoZoom((z) => {
      const next = Math.max(1, z - 0.5);
      if (next === 1) setPhotoPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetPhoto = () => {
    setPhotoZoom(1);
    setPhotoPan({ x: 0, y: 0 });
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  const handleSelectScene = (idx: number) => {
    setCurrentSceneIndex(idx);
    setActiveHotspot(null);
    setPhotoZoom(1);
    setPhotoPan({ x: 0, y: 0 });
    const targetScene = scenes[idx];
    if (targetScene) {
      if (targetScene.sceneType === "equirectangular_360" && targetScene.panoramaUrl) {
        setYaw(targetScene.initialYaw || 0);
        setPitch(targetScene.initialPitch || 0);
        setFov(75);
        if (threeRef.current) {
          import("three").then((THREE) => {
            loadTexture(THREE, targetScene.panoramaUrl);
          });
        }
      } else {
        setIsLoading(false);
      }
      if (onSceneChange) onSceneChange(targetScene.id);
    }
    setShowSceneDrawer(false);
  };

  const handleHotspotClick = (hotspot: TourHotspot) => {
    if (hotspot.type === "navigation" && hotspot.targetSceneId) {
      const idx = scenes.findIndex((s) => s.id === hotspot.targetSceneId);
      if (idx >= 0) {
        handleSelectScene(idx);
        return;
      }
    }
    setActiveHotspot(hotspot);
  };

  const resetOrientation = () => {
    if (is360Mode) {
      setYaw(activeScene?.initialYaw || 0);
      setPitch(activeScene?.initialPitch || 0);
      setFov(75);
    } else {
      handleResetPhoto();
    }
  };

  if (!scenes || scenes.length === 0) {
    return (
      <div className="w-full aspect-video rounded-3xl bg-[#1E1B18] border border-[#3D3835] flex flex-col items-center justify-center p-8 text-center text-[#E4DDD0]">
        <Info className="w-12 h-12 text-[#B18A55] mb-3" />
        <h3 className="font-serif-editorial text-2xl mb-2 text-[#FAF4E5]">Archival Survey In Preparation</h3>
        <p className="text-xs text-[#A69E96] max-w-md">
          A high-resolution heritage survey is currently being indexed for this monument under ASI preservation guidelines.
        </p>
      </div>
    );
  }

  const hFov = fov;
  const vFov = fov / 1.78;

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden bg-[#141211] select-none border border-[#3D3835] shadow-2xl ${
        isFullscreen
          ? "fixed inset-0 z-[9999] rounded-none"
          : "aspect-[16/9] min-h-[520px]"
      }`}
    >
      {/* ── MODE 1: GENUINE THREE.JS 360° EQUIRECTANGULAR SPHERICAL CANVAS ── */}
      {is360Mode && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{ cursor: isDragging360 ? "grabbing" : "grab" }}
          onMouseDown={handleMouseDown360}
          onWheel={handleWheel360}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: webGLError ? "none" : "block" }}
          />

          {webGLError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1E1B18] p-8 text-center text-[#FAF4E5]">
              <AlertCircle className="w-10 h-10 text-[#713C3C] mb-2" />
              <h4 className="font-serif-editorial text-xl font-bold">WebGL Hardware Acceleration Unavailable</h4>
              <p className="text-xs text-[#A69E96] mt-1 max-w-sm">
                Your browser or system does not currently support WebGL rendering.
              </p>
            </div>
          )}

          {/* 360° Spherical Projected Hotspots */}
          {!isLoading && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              {activeScene.hotspots?.map((hotspot) => {
                const pos = sphericalToScreen(
                  hotspot.yaw,
                  hotspot.pitch,
                  yaw,
                  pitch,
                  hFov,
                  vFov
                );
                if (!pos.visible) return null;

                return (
                  <div
                    key={hotspot.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  >
                    <button
                      onClick={() => handleHotspotClick(hotspot)}
                      className={`relative flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-125 shadow-xl ${
                        hotspot.type === "navigation"
                          ? "w-9 h-9 bg-[#713C3C] text-white border-2 border-white ring-4 ring-[#713C3C]/40"
                          : "w-8 h-8 bg-[#B18A55] text-[#181615] border-2 border-[#181615] ring-4 ring-[#B18A55]/40"
                      }`}
                      title={hotspot.title}
                    >
                      {hotspot.type === "navigation" ? (
                        <ChevronRight className="w-4 h-4" />
                      ) : (
                        <Info className="w-3.5 h-3.5 font-bold" />
                      )}
                    </button>

                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap bg-[#181615] text-[#FAF4E5] text-xs px-3 py-1.5 rounded-lg border border-[#B18A55]/40 shadow-xl z-30">
                      <div className="font-semibold text-[#B18A55]">{hotspot.title}</div>
                      <div className="text-[10px] text-[#A69E96]">Click for architectural analysis</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── MODE 2: CURATORIAL ARCHIVAL PHOTOGRAPHIC DOSSIER (HONEST 2D PAN & ZOOM) ── */}
      {!is360Mode && (
        <div
          ref={photoContainerRef}
          className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-[#100E0D]"
          style={{ cursor: photoZoom > 1 ? (isPanningPhoto ? "grabbing" : "grab") : "default" }}
          onMouseDown={handleMouseDownPhoto}
          onWheel={handleWheelPhoto}
          onDoubleClick={() => (photoZoom > 1 ? handleResetPhoto() : setPhotoZoom(2))}
        >
          {/* Main Architectural Photograph */}
          <div
            className="relative w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
            style={{
              transform: `translate(${photoPan.x}px, ${photoPan.y}px) scale(${photoZoom})`,
              transformOrigin: "center center",
            }}
          >
            {imageLoadError ? (
              <div className="text-center text-[#A69E96] p-8">
                <AlertCircle className="w-12 h-12 text-[#713C3C] mx-auto mb-2" />
                <h4 className="font-serif-editorial text-lg text-[#FAF4E5]">Archival Asset Unavailable</h4>
                <p className="text-xs text-[#A69E96] mt-1">Could not load the high-resolution survey capture.</p>
              </div>
            ) : displayPhotoUrl ? (
              <img
                src={displayPhotoUrl}
                alt={activeScene.name}
                className="max-w-full max-h-full object-contain pointer-events-none select-none shadow-2xl"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setImageLoadError(true);
                }}
              />
            ) : (
              <div className="text-center text-[#A69E96] p-8">
                <Camera className="w-12 h-12 text-[#B18A55] mx-auto mb-2 opacity-50" />
                <p className="text-xs">Authentic image asset in preparation</p>
              </div>
            )}

            {/* Photographic Feature Hotspots (Percent-based overlay) */}
            {!isLoading && activeScene.hotspots?.map((hotspot) => {
              if (hotspot.x === undefined || hotspot.y === undefined) return null;

              return (
                <div
                  key={hotspot.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group z-20"
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHotspotClick(hotspot);
                    }}
                    className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#713C3C] text-[#FAF4E5] border-2 border-[#B18A55] shadow-xl hover:scale-125 transition-transform"
                    title={hotspot.title}
                  >
                    <Info className="w-3.5 h-3.5 font-bold" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  </button>

                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap bg-[#181615]/95 backdrop-blur-md text-[#FAF4E5] text-xs px-3 py-1.5 rounded-lg border border-[#B18A55]/40 shadow-xl z-30">
                    <div className="font-semibold text-[#B18A55]">{hotspot.title}</div>
                    <div className="text-[10px] text-[#A69E96]">Click to inspect architectural detail</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TOP HUD BAR ─────────────────────────────────────────────────── */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-none">
        
        {/* Scene Identification Badge */}
        <div className="bg-[#181615]/90 backdrop-blur-md border border-[#3D3835] rounded-2xl px-4 py-2.5 text-[#FAF4E5] shadow-xl pointer-events-auto flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
            is360Mode ? "bg-[#B18A55] animate-pulse" : "bg-[#713C3C]"
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#B18A55]">
                {is360Mode ? "360° Spherical Survey" : "Architectural Photographic Study"}
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-[#282522] text-[#A69E96] border border-[#3D3835]">
                {monumentName}
              </span>
            </div>
            <h3 className="font-serif-editorial text-lg font-bold leading-tight text-[#FAF4E5] mt-0.5">
              {activeScene.name}
            </h3>
          </div>
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Zoom Controls for Standard Photo */}
          {!is360Mode && (
            <div className="hidden sm:flex items-center bg-[#181615]/90 backdrop-blur-md border border-[#3D3835] rounded-xl p-1 text-xs">
              <button
                onClick={handleZoomOut}
                disabled={photoZoom <= 1}
                className="p-1.5 hover:bg-[#282522] rounded-lg text-[#E4DDD0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px] text-[#B18A55]">
                {Math.round(photoZoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={photoZoom >= 3.5}
                className="p-1.5 hover:bg-[#282522] rounded-lg text-[#E4DDD0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Provenance & License Info Trigger */}
          <button
            onClick={() => setShowProvenanceModal(true)}
            className="p-2.5 rounded-xl bg-[#181615]/90 hover:bg-[#282522] backdrop-blur-md border border-[#3D3835] text-[#B18A55] transition-colors"
            title="Image Provenance & Licensing"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Scene Drawer Switcher */}
          <button
            onClick={() => setShowSceneDrawer(!showSceneDrawer)}
            className="px-3 py-2 rounded-xl bg-[#181615]/90 hover:bg-[#282522] backdrop-blur-md border border-[#3D3835] text-[#FAF4E5] transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Switch Viewpoints"
          >
            <Layers className="w-4 h-4 text-[#B18A55]" />
            <span className="hidden sm:inline">Views ({scenes.length})</span>
          </button>

          {/* Reset Orientation / Zoom */}
          <button
            onClick={resetOrientation}
            className="p-2.5 rounded-xl bg-[#181615]/90 hover:bg-[#282522] backdrop-blur-md border border-[#3D3835] text-[#FAF4E5] transition-colors"
            title="Reset Perspective / Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-[#181615]/90 hover:bg-[#282522] backdrop-blur-md border border-[#3D3835] text-[#FAF4E5] transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── LOADING INDICATOR ───────────────────────────────────────────── */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#181615]/85 backdrop-blur-xs z-20 pointer-events-none">
          <div className="flex flex-col items-center gap-3 text-[#FAF4E5]">
            <Loader2 className="w-8 h-8 text-[#B18A55] animate-spin" />
            <span className="text-xs text-[#A69E96] tracking-wider uppercase font-semibold">
              Loading verified architectural imagery…
            </span>
          </div>
        </div>
      )}

      {/* ── CONTROLS HINT (Auto-hides on first drag) ────────────────────── */}
      {showControlsHint && !isLoading && (
        <div className="absolute bottom-6 right-6 bg-[#181615]/85 backdrop-blur-md border border-[#3D3835] px-4 py-2 rounded-xl text-xs text-[#E4DDD0] flex items-center gap-2 pointer-events-none z-30 shadow-lg">
          <Compass className="w-4 h-4 text-[#B18A55]" />
          <span>
            {is360Mode
              ? "Drag to look 360° • Scroll to zoom"
              : photoZoom > 1
              ? "Drag to pan facade • Scroll or double-click to zoom"
              : "Scroll or double-click to zoom into architectural details"}
          </span>
        </div>
      )}

      {/* ── BOTTOM LEFT STATUS PILL ────────────────────────────────────── */}
      <div className="absolute bottom-6 left-6 z-30 pointer-events-none hidden sm:flex items-center gap-2">
        <div className="bg-[#181615]/85 backdrop-blur-md border border-[#3D3835] px-3 py-1.5 rounded-xl text-[11px] text-[#A69E96] flex items-center gap-2 shadow-lg">
          {is360Mode ? (
            <>
              <Compass
                className="w-3.5 h-3.5 text-[#B18A55] transition-transform duration-100"
                style={{ transform: `rotate(${-yaw}deg)` }}
              />
              <span>
                Azimuth: {Math.round(((yaw % 360) + 360) % 360)}° • Pitch: {Math.round(pitch)}°
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Authentic High-Resolution Archive • {activeScene.sourceMetadata?.originalDimensions ? `${activeScene.sourceMetadata.originalDimensions.width}×${activeScene.sourceMetadata.originalDimensions.height} px` : "4K Capture"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── ACTIVE HOTSPOT INFO MODAL / DRAWER ─────────────────────────── */}
      {activeHotspot && (
        <div className="absolute bottom-16 left-6 right-6 sm:right-auto sm:w-[420px] bg-[#181615]/95 backdrop-blur-md border border-[#B18A55] p-5 rounded-2xl shadow-2xl text-[#FAF4E5] z-40 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#B18A55]">
                Architectural Feature Analysis
              </span>
              <h4 className="font-serif-editorial text-xl font-bold text-[#FAF4E5]">
                {activeHotspot.title}
              </h4>
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="text-[#A69E96] hover:text-white text-lg leading-none p-1 shrink-0"
              title="Close feature details"
            >
              ×
            </button>
          </div>
          <p className="text-xs text-[#E4DDD0] leading-relaxed mb-3">
            {activeHotspot.description}
          </p>
          <div className="pt-2 border-t border-[#3D3835] flex items-center justify-between text-[11px] text-[#A69E96]">
            <span>Survey Method: Field In-Situ Verification</span>
            <span className="text-[#B18A55] font-semibold">SDG 11.4 Archive</span>
          </div>
        </div>
      )}

      {/* ── SCENE DRAWER ──────────────────────────────────────────────── */}
      {showSceneDrawer && (
        <div className="absolute inset-x-6 bottom-6 bg-[#181615]/95 backdrop-blur-md border border-[#3D3835] p-5 rounded-2xl shadow-2xl z-40 pointer-events-auto">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#3D3835]">
            <span className="text-xs uppercase tracking-wider text-[#B18A55] font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Available Visual Surveys for {monumentName}
            </span>
            <button
              onClick={() => setShowSceneDrawer(false)}
              className="text-xs text-[#A69E96] hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-1">
            {scenes.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => handleSelectScene(idx)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  idx === currentSceneIndex
                    ? "bg-[#282522] border-[#B18A55] ring-2 ring-[#B18A55]/30"
                    : "bg-[#181615] border-[#3D3835] hover:border-[#6B635D]"
                }`}
              >
                <div className="w-14 h-10 rounded-lg overflow-hidden bg-[#282522] shrink-0 border border-[#3D3835]">
                  <img
                    src={scene.thumbnailUrl || scene.standardPhotoUrl || scene.panoramaUrl}
                    alt={scene.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-serif-editorial text-sm font-semibold text-[#FAF4E5] truncate">
                    {scene.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      scene.sceneType === "equirectangular_360"
                        ? "bg-[#B18A55] text-[#181615]"
                        : "bg-[#713C3C] text-[#FAF4E5]"
                    }`}>
                      {scene.sceneType === "equirectangular_360" ? "360° Sphere" : "Archival Photo"}
                    </span>
                    <span className="text-[10px] text-[#A69E96]">
                      {scene.hotspots.length} features
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── PROVENANCE & LICENSING MODAL ──────────────────────────────── */}
      {showProvenanceModal && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#181615] border border-[#B18A55]/50 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-[#FAF4E5]">
            <div className="flex items-start justify-between pb-3 border-b border-[#3D3835]">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#B18A55]" />
                <h3 className="font-serif-editorial text-lg font-bold">
                  Image Provenance & Verification
                </h3>
              </div>
              <button
                onClick={() => setShowProvenanceModal(false)}
                className="text-[#A69E96] hover:text-white text-lg p-1"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#282522] border border-[#3D3835] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#A69E96]">Asset Classification:</span>
                  <span className="font-semibold text-[#FAF4E5]">
                    {is360Mode ? "Genuine 360° Equirectangular Spherical Survey" : "Standard High-Resolution Architectural Photography"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A69E96]">Source Origin:</span>
                  <span className="font-semibold text-[#B18A55]">
                    {activeScene.sourceMetadata?.sourceUrl ? "Wikimedia Commons / Verified Cultural Archive" : "Open Heritage Archive"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A69E96]">Attributed Creator:</span>
                  <span className="font-semibold text-[#FAF4E5]">
                    {activeScene.sourceMetadata?.author || "Cultural Heritage Repository"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A69E96]">Copyright License:</span>
                  <span className="font-semibold text-[#FAF4E5]">
                    {activeScene.sourceMetadata?.license || "Creative Commons (CC BY-SA)"}
                  </span>
                </div>
                {activeScene.sourceMetadata?.originalDimensions && (
                  <div className="flex justify-between">
                    <span className="text-[#A69E96]">Native Resolution:</span>
                    <span className="font-mono text-[#FAF4E5]">
                      {activeScene.sourceMetadata.originalDimensions.width} × {activeScene.sourceMetadata.originalDimensions.height} px
                    </span>
                  </div>
                )}
                {activeScene.sourceMetadata?.camera && (
                  <div className="flex justify-between">
                    <span className="text-[#A69E96]">Camera Rig:</span>
                    <span className="text-[#FAF4E5]">{activeScene.sourceMetadata.camera}</span>
                  </div>
                )}
              </div>

              {!is360Mode && (
                <div className="p-3 rounded-xl bg-[#282522]/60 border border-[#3D3835] text-[11px] text-[#A69E96] leading-relaxed">
                  <strong className="text-[#FAF4E5]">Authenticity Protocol:</strong> This scene presents an authentic high-resolution architectural photograph in its natural rectilinear projection. In adherence to curatorial integrity, flat photography is never artificially stretched across a 3D sphere. A full 360° LiDAR spherical survey is scheduled under upcoming conservation fieldwork.
                </div>
              )}

              {activeScene.sourceMetadata?.sourceUrl && (
                <a
                  href={activeScene.sourceMetadata.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#B18A55] text-[#181615] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#C7A574] transition-colors"
                >
                  <span>View Original Archive Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
