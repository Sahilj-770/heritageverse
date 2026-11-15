"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { ModelCanvas } from "./ModelCanvas";
import { ArchitecturalHotspots } from "./ArchitecturalHotspots";
import { ModelLoadingState } from "./ModelLoadingState";
import { loadGLTFModel, disposeHierarchy } from "@/lib/3d/modelLoader";
import { projectWorldToScreen, SmoothCameraController } from "@/lib/3d/cameraController";
import { Monument3DManifestEntry, ArchitecturalHotspot3D, LightingPreset } from "@/lib/3d/types";

interface MonumentModelViewerProps {
  entry: Monument3DManifestEntry;
  modelUrl: string;
  lightingPreset?: LightingPreset;
  isWireframe?: boolean;
  cameraPresetTarget?: "front" | "top" | "fountain" | null;
  onSelectHotspot?: (hotspot: ArchitecturalHotspot3D) => void;
}

export function MonumentModelViewer({
  entry,
  modelUrl,
  lightingPreset = "studio",
  isWireframe = false,
  cameraPresetTarget,
  onSelectHotspot,
}: MonumentModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<ArchitecturalHotspot3D | null>(null);
  const [projectedPositions, setProjectedPositions] = useState<
    Record<string, { x: number; y: number; visible: boolean }>
  >({});

  const threeRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    modelGroup: THREE.Group;
    cameraController: SmoothCameraController;
    isOrbiting: boolean;
    orbitStart: { x: number; y: number; theta: number; phi: number };
    theta: number; // azimuth
    phi: number; // elevation
    radius: number;
    target: THREE.Vector3;
  } | null>(null);

  const loadedUrlRef = useRef<string | null>(null);

  // Apply wireframe to all child meshes
  function applyWireframe(group: THREE.Group, wireframe: boolean) {
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((m) => {
            if ("wireframe" in m) {
              (m as THREE.MeshStandardMaterial).wireframe = wireframe;
              m.needsUpdate = true;
            }
          });
        }
      }
    });
  }

  // Load or Swap 3D Model into the existing Three.js Scene
  const loadModel = useCallback(
    async (url: string) => {
      if (!threeRef.current) return;
      const { modelGroup } = threeRef.current;

      try {
        setIsLoading(true);
        setLoadProgress(0);

        // Safely dispose old model hierarchy and clear children
        disposeHierarchy(modelGroup);
        while (modelGroup.children.length > 0) {
          modelGroup.remove(modelGroup.children[0]);
        }

        const gltfScene = await loadGLTFModel(url, (pct) => setLoadProgress(pct));
        if (threeRef.current) {
          modelGroup.add(gltfScene);
          applyWireframe(modelGroup, isWireframe);
          loadedUrlRef.current = url;
        }
      } catch (err) {
        console.error("Failed to load model:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [isWireframe]
  );

  // Initialize Three.js Scene once WebGL Canvas is ready
  const handleSceneReady = useCallback(
    (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
      const cameraController = new SmoothCameraController(camera);
      const modelGroup = new THREE.Group();
      scene.add(modelGroup);

      threeRef.current = {
        scene,
        camera,
        renderer,
        modelGroup,
        cameraController,
        isOrbiting: false,
        orbitStart: { x: 0, y: 0, theta: 0, phi: 0 },
        theta: 0,
        phi: 0.26,
        radius: 52,
        target: new THREE.Vector3(0, 4.5, 12),
      };

      loadModel(modelUrl);
    },
    [modelUrl, loadModel]
  );

  // When modelUrl changes after initial load, swap model seamlessly without recreating the canvas
  useEffect(() => {
    if (threeRef.current && loadedUrlRef.current !== modelUrl) {
      loadModel(modelUrl);
    }
  }, [modelUrl, loadModel]);

  useEffect(() => {
    if (threeRef.current?.modelGroup) {
      applyWireframe(threeRef.current.modelGroup, isWireframe);
    }
  }, [isWireframe]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Native non-passive wheel event listener to avoid Chrome passive listener errors
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      if (!threeRef.current) return;
      const zoomSpeed = 0.03;
      threeRef.current.radius = Math.max(
        8,
        Math.min(95, threeRef.current.radius + e.deltaY * zoomSpeed)
      );

      const { camera, theta, phi, radius, target } = threeRef.current;
      camera.position.x = target.x + radius * Math.sin(theta) * Math.cos(phi);
      camera.position.y = target.y + radius * Math.sin(phi);
      camera.position.z = target.z + radius * Math.cos(theta) * Math.cos(phi);
      camera.lookAt(target);
    };

    el.addEventListener("wheel", onWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", onWheelNative);
  }, []);

  // Camera Presets
  useEffect(() => {
    if (!threeRef.current || !cameraPresetTarget) return;
    const { cameraController } = threeRef.current;

    switch (cameraPresetTarget) {
      case "front":
        threeRef.current.target.set(0, 5.0, 14);
        cameraController.flyTo([0, 11.5, 48], [0, 5.0, 14], 0.08);
        break;
      case "top":
        threeRef.current.target.set(0, 2, -10);
        cameraController.flyTo([0, 55, 30], [0, 2, -10], 0.08);
        break;
      case "fountain":
        threeRef.current.target.set(0, 1.2, -5);
        cameraController.flyTo([0, 7, 7], [0, 1.2, -5], 0.08);
        break;
    }
  }, [cameraPresetTarget]);

  // Per-Frame Render Tick: Updates camera transitions & projects 3D hotspot coordinates
  const handleRenderTick = useCallback(() => {
    if (!threeRef.current) return;
    const { camera, cameraController, renderer } = threeRef.current;

    // Smooth camera interpolation
    cameraController.update();

    // Hotspot screen projection
    if (entry.exteriorHotspots && entry.exteriorHotspots.length > 0) {
      const newPositions: Record<string, { x: number; y: number; visible: boolean }> = {};
      entry.exteriorHotspots.forEach((hotspot) => {
        newPositions[hotspot.id] = projectWorldToScreen(hotspot.position, camera);
      });
      setProjectedPositions(newPositions);
    }
  }, [entry.exteriorHotspots]);

  // Orbit Drag Controls via Mouse / Touch
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!threeRef.current || activeHotspot) return;
    threeRef.current.isOrbiting = true;
    threeRef.current.orbitStart = {
      x: e.clientX,
      y: e.clientY,
      theta: threeRef.current.theta,
      phi: threeRef.current.phi,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!threeRef.current || !threeRef.current.isOrbiting) return;
    const dx = e.clientX - threeRef.current.orbitStart.x;
    const dy = e.clientY - threeRef.current.orbitStart.y;

    const sensitivity = 0.007;
    threeRef.current.theta = threeRef.current.orbitStart.theta - dx * sensitivity;
    threeRef.current.phi = Math.max(
      0.05,
      Math.min(Math.PI / 2 - 0.05, threeRef.current.orbitStart.phi + dy * sensitivity)
    );

    const { camera, theta, phi, radius, target } = threeRef.current;
    camera.position.x = target.x + radius * Math.sin(theta) * Math.cos(phi);
    camera.position.y = target.y + radius * Math.sin(phi);
    camera.position.z = target.z + radius * Math.cos(theta) * Math.cos(phi);
    camera.lookAt(target);
  };

  const handleMouseUp = () => {
    if (threeRef.current) threeRef.current.isOrbiting = false;
  };

  const handleHotspotClick = (hotspot: ArchitecturalHotspot3D) => {
    setActiveHotspot(hotspot);
    if (onSelectHotspot) onSelectHotspot(hotspot);

    if (threeRef.current) {
      const { cameraController } = threeRef.current;
      const targetPos = hotspot.cameraPosition || [
        hotspot.position[0],
        hotspot.position[1] + 2,
        hotspot.position[2] + 8,
      ];
      const targetLookAt = hotspot.cameraTarget || hotspot.position;
      cameraController.flyTo(targetPos, targetLookAt, 0.08);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (threeRef.current?.modelGroup) {
        disposeHierarchy(threeRef.current.modelGroup);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: isLoading ? "wait" : "grab" }}
    >
      <ModelCanvas
        onSceneReady={handleSceneReady}
        onRenderTick={handleRenderTick}
        lightingPreset={lightingPreset}
      />

      {isLoading && (
        <ModelLoadingState progress={loadProgress} monumentName={entry.name} />
      )}

      {!isLoading && entry.exteriorHotspots && (
        <ArchitecturalHotspots
          hotspots={entry.exteriorHotspots}
          projectedPositions={projectedPositions}
          activeHotspot={activeHotspot}
          onSelectHotspot={handleHotspotClick}
          onCloseHotspot={() => setActiveHotspot(null)}
        />
      )}

      {/* Subtle Hint HUD */}
      {!isLoading && (
        <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-2 bg-[#181615]/80 backdrop-blur-md border border-[#3D3835] px-3.5 py-1.5 rounded-xl text-[11px] text-[#A69E96] shadow-xl pointer-events-none z-30">
          <span>Drag to orbit • Scroll to zoom • Click pins for architectural analysis</span>
        </div>
      )}
    </div>
  );
}
