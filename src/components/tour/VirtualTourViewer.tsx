"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
} from "lucide-react";

interface VirtualTourViewerProps {
  scenes: TourScene[];
  monumentName: string;
  onSceneChange?: (sceneId: string) => void;
}

// Convert spherical angles (yaw/pitch in degrees) to screen XY position
// given the current camera orientation and FOV.
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

  // Cull if behind camera (outside ±hFov/2 and ±vFov/2 margins)
  if (Math.abs(dy) > hFov * 0.6 || Math.abs(dp) > vFov * 0.65) {
    return { x: 0, y: 0, visible: false };
  }

  // Map to screen percentage using tangent for perspective correctness
  const tanHalf = Math.tan((hFov * Math.PI) / 360);
  const tanHalfV = Math.tan((vFov * Math.PI) / 360);
  const x = 50 + (Math.tan((dy * Math.PI) / 180) / tanHalf) * 50;
  const y = 50 - (Math.tan((dp * Math.PI) / 180) / tanHalfV) * 50;

  return { x, y, visible: true };
}

export function VirtualTourViewer({
  scenes,
  monumentName,
  onSceneChange,
}: VirtualTourViewerProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<TourHotspot | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSceneDrawer, setShowSceneDrawer] = useState(false);
  const [showControlsHint, setShowControlsHint] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [webGLError, setWebGLError] = useState(false);

  // Camera orientation
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [fov, setFov] = useState(75);

  // Three.js refs — stored as any to avoid SSR type issues
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<{
    renderer: any;
    scene: any;
    camera: any;
    mesh: any;
    texture: any;
    animFrame: number;
    loader: any;
  } | null>(null);

  const dragStartRef = useRef<{ x: number; y: number; yaw: number; pitch: number }>({
    x: 0,
    y: 0,
    yaw: 0,
    pitch: 0,
  });

  const activeScene = scenes[currentSceneIndex] || scenes[0];

  // Clamp pitch to ±85 degrees
  const clampPitch = (p: number) => Math.max(-85, Math.min(85, p));

  // ─── Initialise Three.js scene ───────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return;

    let cancelled = false;

    async function init() {
      try {
        // Dynamic import — keeps the bundle lean for pages that don't need it
        const THREE = await import("three");

        if (cancelled || !canvasRef.current) return;

        // Check WebGL support
        const testCanvas = document.createElement("canvas");
        const gl =
          testCanvas.getContext("webgl2") || testCanvas.getContext("webgl");
        if (!gl) {
          setWebGLError(true);
          return;
        }

        const canvas = canvasRef.current;
        const W = canvas.clientWidth || 1280;
        const H = canvas.clientHeight || 720;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W, H, false);

        // Scene
        const scene = new THREE.Scene();

        // Camera — perspective, FOV drives zoom
        const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
        camera.position.set(0, 0, 0);

        // Sphere geometry — large radius, inside view (BackSide)
        const geo = new THREE.SphereGeometry(500, 60, 40);
        const mat = new THREE.MeshBasicMaterial({
          side: THREE.BackSide,
          color: 0x1a1612, // placeholder color while texture loads
        });
        const mesh = new THREE.Mesh(geo, mat);
        // Flip X to mirror correctly (equirectangular left-right)
        mesh.scale.set(-1, 1, 1);
        scene.add(mesh);

        // Texture loader
        const loader = new THREE.TextureLoader();

        threeRef.current = { renderer, scene, camera, mesh, texture: null, animFrame: 0, loader };

        // Render loop
        function renderLoop() {
          if (!threeRef.current) return;
          threeRef.current.animFrame = requestAnimationFrame(renderLoop);
          threeRef.current.renderer.render(
            threeRef.current.scene,
            threeRef.current.camera
          );
        }
        renderLoop();

        // Resize observer
        const ro = new ResizeObserver(() => {
          if (!threeRef.current || !canvas) return;
          const w = canvas.clientWidth;
          const h = canvas.clientHeight;
          threeRef.current.renderer.setSize(w, h, false);
          threeRef.current.camera.aspect = w / h;
          threeRef.current.camera.updateProjectionMatrix();
        });
        ro.observe(canvas);

        // Load initial texture
        loadTexture(THREE, scenes[0]?.panoramaUrl);
      } catch (err) {
        console.error("Three.js init error:", err);
        setWebGLError(true);
      }
    }

    init();

    return () => {
      cancelled = true;
      if (threeRef.current) {
        cancelAnimationFrame(threeRef.current.animFrame);
        threeRef.current.renderer.dispose();
        threeRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Load panorama texture whenever scene changes ─────────────────────
  const loadTexture = useCallback(
    async (THREE: any, url: string | undefined) => {
      if (!threeRef.current || !url) return;
      setIsLoading(true);

      const { loader, mesh } = threeRef.current;

      try {
        const texture: any = await new Promise((resolve, reject) => {
          loader.load(
            url,
            (t: any) => resolve(t),
            undefined,
            (err: any) => reject(err)
          );
        });

        if (!threeRef.current) return; // component unmounted

        // Apply color space for correct gamma
        const THREE_local = await import("three");
        texture.colorSpace = THREE_local.SRGBColorSpace;
        texture.minFilter = THREE_local.LinearFilter;
        texture.generateMipmaps = false;

        // Dispose old texture
        if (threeRef.current.texture) {
          threeRef.current.texture.dispose();
        }
        threeRef.current.texture = texture;
        (mesh.material as any).map = texture;
        (mesh.material as any).color.set(0xffffff);
        (mesh.material as any).needsUpdate = true;
      } catch {
        console.warn("Panorama texture load failed — showing placeholder.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Load new texture on scene switch
  useEffect(() => {
    if (!threeRef.current || !activeScene) return;

    async function switchScene() {
      const THREE = await import("three");
      setYaw(activeScene.initialYaw || 0);
      setPitch(activeScene.initialPitch || 0);
      setFov(75);
      setActiveHotspot(null);
      await loadTexture(THREE, activeScene.panoramaUrl);
    }
    switchScene();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSceneIndex]);

  // ─── Sync camera with yaw/pitch/fov state ────────────────────────────
  useEffect(() => {
    if (!threeRef.current) return;
    const { camera } = threeRef.current;

    // Convert to Three.js Euler angles:
    // yaw  → Y rotation (horizontal pan)
    // pitch → X rotation (vertical tilt)
    const yawRad = (yaw * Math.PI) / 180;
    const pitchRad = (pitch * Math.PI) / 180;

    // Direction vector
    const x = Math.cos(pitchRad) * Math.sin(yawRad);
    const y = Math.sin(pitchRad);
    const z = Math.cos(pitchRad) * Math.cos(yawRad);
    camera.lookAt(x, y, z);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [yaw, pitch, fov]);

  // ─── Pointer events ───────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, yaw, pitch };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      const sensitivity = 0.18;
      setYaw((dragStartRef.current.yaw - dx * sensitivity + 360) % 360);
      setPitch(clampPitch(dragStartRef.current.pitch + dy * sensitivity));
      if (showControlsHint) setShowControlsHint(false);
    },
    [isDragging, showControlsHint]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      yaw,
      pitch,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    const sensitivity = 0.22;
    setYaw((dragStartRef.current.yaw - dx * sensitivity + 360) % 360);
    setPitch(clampPitch(dragStartRef.current.pitch + dy * sensitivity));
    if (showControlsHint) setShowControlsHint(false);
  };

  const handleTouchEnd = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setFov((prev) => Math.max(40, Math.min(100, prev + e.deltaY * 0.04)));
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // ─── Fullscreen ───────────────────────────────────────────────────────
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
    const onFSChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  // ─── Scene switching ──────────────────────────────────────────────────
  const handleSelectScene = (idx: number) => {
    setCurrentSceneIndex(idx);
    if (scenes[idx] && onSceneChange) onSceneChange(scenes[idx].id);
    setShowSceneDrawer(false);
  };

  const handleHotspotClick = (hotspot: TourHotspot) => {
    if (hotspot.type === "navigation" && hotspot.targetSceneId) {
      const idx = scenes.findIndex((s) => s.id === hotspot.targetSceneId);
      if (idx >= 0) { handleSelectScene(idx); return; }
    }
    setActiveHotspot(hotspot);
  };

  const resetOrientation = () => {
    setYaw(activeScene?.initialYaw || 0);
    setPitch(activeScene?.initialPitch || 0);
    setFov(75);
  };

  // ─── Empty state ──────────────────────────────────────────────────────
  if (!scenes || scenes.length === 0) {
    return (
      <div className="w-full aspect-video rounded-xl bg-[#262220] border border-[#3D3835] flex flex-col items-center justify-center p-8 text-center text-[#FAF4E5]">
        <Info className="w-12 h-12 text-[#C5A059] mb-3" />
        <h3 className="font-serif-editorial text-2xl mb-2">Virtual Tour In Preparation</h3>
        <p className="text-sm text-[#938A82] max-w-md">
          A high-resolution 360° equirectangular survey has been scheduled for this monument as part of upcoming field preservation work.
        </p>
      </div>
    );
  }

  // Horizontal / Vertical FOV for hotspot positioning
  const hFov = fov;
  const vFov = threeRef.current
    ? threeRef.current.camera.fov /
      (threeRef.current.camera.aspect || 1.78)
    : fov / 1.78;

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden bg-[#181615] select-none border border-[#3D3835] shadow-2xl ${
        isFullscreen
          ? "fixed inset-0 z-[9999] rounded-none"
          : "aspect-[16/9] min-h-[480px]"
      }`}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* ── WebGL Canvas — the actual sphere ───────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: webGLError ? "none" : "block" }}
      />

      {/* ── WebGL not available fallback ────────────────────────────── */}
      {webGLError && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${activeScene.panoramaUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.9)",
          }}
        />
      )}

      {/* ── Loading indicator ────────────────────────────────────────── */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#181615]/80 z-20 pointer-events-none">
          <div className="flex flex-col items-center gap-3 text-[#FAF4E5]">
            <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin" />
            <span className="text-xs text-[#938A82] tracking-wider uppercase font-medium">
              Loading panorama…
            </span>
          </div>
        </div>
      )}

      {/* ── Vignette overlay ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(24,22,21,0.65) 100%)",
        }}
      />

      {/* ── Top HUD bar ──────────────────────────────────────────────── */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-none">
        {/* Scene label */}
        <div className="bg-[#181615]/85 backdrop-blur-md border border-[#C5A059]/40 rounded-xl px-4 py-2 text-[#FAF4E5] shadow-lg flex items-center gap-3 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-pulse" />
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#C5A059] font-medium">
              360° Virtual Experience · {monumentName}
            </div>
            <div className="font-serif text-lg font-bold leading-tight">
              {activeScene.name}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowSceneDrawer(!showSceneDrawer)}
            className="p-2.5 rounded-xl bg-[#181615]/85 hover:bg-[#262220] backdrop-blur-md border border-[#3D3835] text-[#FAF4E5] transition-colors flex items-center gap-2 text-xs font-medium"
            title="Switch Scene"
          >
            <Layers className="w-4 h-4 text-[#C5A059]" />
            <span className="hidden sm:inline">Scenes ({scenes.length})</span>
          </button>

          <button
            onClick={resetOrientation}
            className="p-2.5 rounded-xl bg-[#181615]/85 hover:bg-[#262220] backdrop-blur-md border border-[#3D3835] text-[#FAF4E5] transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-[#181615]/85 hover:bg-[#262220] backdrop-blur-md border border-[#3D3835] text-[#FAF4E5] transition-colors"
            title="Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* ── Hotspots (perspective-correct positions) ─────────────────── */}
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
                      ? "w-10 h-10 bg-[#C85A32] text-white border-2 border-white ring-4 ring-[#C85A32]/40"
                      : "w-9 h-9 bg-[#C5A059] text-[#181615] border-2 border-[#181615] ring-4 ring-[#C5A059]/40"
                  }`}
                  title={hotspot.title}
                >
                  {hotspot.type === "navigation" ? (
                    <ChevronRight className="w-5 h-5" />
                  ) : (
                    <Info className="w-4 h-4 font-bold" />
                  )}
                </button>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap bg-[#181615] text-[#FAF4E5] text-xs px-3 py-1.5 rounded-md border border-[#C5A059]/40 shadow-xl z-30">
                  <div className="font-semibold text-[#C5A059]">{hotspot.title}</div>
                  <div className="text-[10px] text-[#938A82]">
                    {hotspot.type === "navigation"
                      ? "Click to navigate"
                      : "Click for details"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Active Hotspot Info Panel ─────────────────────────────────── */}
      {activeHotspot && (
        <div className="absolute bottom-16 left-4 sm:left-6 w-auto sm:w-96 bg-[#181615]/95 backdrop-blur-md border border-[#C5A059] p-5 rounded-2xl shadow-2xl text-[#FAF4E5] z-40 pointer-events-auto">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="font-serif text-lg font-bold text-[#FAF4E5]">
              {activeHotspot.title}
            </h4>
            <button
              onClick={() => setActiveHotspot(null)}
              className="text-[#938A82] hover:text-white text-xl leading-none p-1 shrink-0"
            >
              ×
            </button>
          </div>
          <p className="text-xs text-[#EADFCF] leading-relaxed mb-3">
            {activeHotspot.description}
          </p>
          {activeHotspot.type === "navigation" && (
            <button
              onClick={() => handleHotspotClick(activeHotspot)}
              className="w-full py-2 bg-[#C85A32] hover:bg-[#B84E27] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              Enter Chamber
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* ── Controls Hint (auto-hides on first drag) ──────────────────── */}
      {showControlsHint && !isLoading && (
        <div className="absolute bottom-16 right-4 sm:right-6 bg-[#181615]/80 backdrop-blur-sm border border-[#3D3835] px-3.5 py-2 rounded-xl text-xs text-[#EADFCF] flex items-center gap-2 pointer-events-none z-30 animate-pulse">
          <Compass className="w-4 h-4 text-[#C5A059]" />
          <span>Drag to explore · Scroll to zoom</span>
        </div>
      )}

      {/* ── Scene Drawer ──────────────────────────────────────────────── */}
      {showSceneDrawer && (
        <div className="absolute inset-x-4 bottom-4 bg-[#181615]/95 backdrop-blur-md border border-[#3D3835] p-4 rounded-2xl shadow-2xl z-40 pointer-events-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-[#C5A059] font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Virtual Waypoints
            </span>
            <button
              onClick={() => setShowSceneDrawer(false)}
              className="text-xs text-[#938A82] hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-1">
            {scenes.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => handleSelectScene(idx)}
                className={`flex flex-col text-left p-2.5 rounded-xl border transition-all ${
                  idx === currentSceneIndex
                    ? "bg-[#262220] border-[#C5A059] ring-2 ring-[#C5A059]/30"
                    : "bg-[#181615] border-[#3D3835] hover:border-[#68615A]"
                }`}
              >
                <span className="font-serif text-sm font-semibold text-[#FAF4E5] truncate">
                  {scene.name}
                </span>
                <span className="text-[10px] text-[#938A82] mt-1">
                  {scene.hotspots.length} hotspots
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Compass & Heading ─────────────────────────────────────────── */}
      <div className="absolute bottom-4 left-4 bg-[#181615]/80 backdrop-blur-sm border border-[#3D3835] px-3 py-1.5 rounded-lg text-[11px] text-[#938A82] flex items-center gap-2 z-30 pointer-events-none">
        <Compass
          className="w-4 h-4 text-[#C5A059] transition-transform duration-150"
          style={{ transform: `rotate(${-yaw}deg)` }}
        />
        <span>
          {Math.round(((yaw % 360) + 360) % 360)}° ·{" "}
          {pitch >= 0 ? `+${Math.round(pitch)}` : Math.round(pitch)}° pitch
        </span>
      </div>
    </div>
  );
}
