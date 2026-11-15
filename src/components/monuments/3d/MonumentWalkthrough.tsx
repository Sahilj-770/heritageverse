"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { ModelCanvas } from "./ModelCanvas";
import { SceneNavigator } from "./SceneNavigator";
import { ArchitecturalHotspots } from "./ArchitecturalHotspots";
import { ModelLoadingState } from "./ModelLoadingState";
import { loadGLTFModel, disposeHierarchy } from "@/lib/3d/modelLoader";
import { CollisionSystem } from "@/lib/3d/collisionSystem";
import { WalkthroughController } from "@/lib/3d/walkthroughController";
import { projectWorldToScreen } from "@/lib/3d/cameraController";
import { WalkthroughArea, ArchitecturalHotspot3D, LightingPreset } from "@/lib/3d/types";
import { MousePointer, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Eye } from "lucide-react";

interface MonumentWalkthroughProps {
  areas: WalkthroughArea[];
  currentAreaId?: string;
  onAreaChange?: (areaId: string) => void;
  lightingPreset?: LightingPreset;
  monumentName: string;
}

export function MonumentWalkthrough({
  areas,
  currentAreaId: initialAreaId,
  onAreaChange,
  lightingPreset = "studio",
  monumentName,
}: MonumentWalkthroughProps) {
  const [activeAreaId, setActiveAreaId] = useState(initialAreaId || areas[0]?.id || "");
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<ArchitecturalHotspot3D | null>(null);
  const [projectedPositions, setProjectedPositions] = useState<
    Record<string, { x: number; y: number; visible: boolean }>
  >({});

  const containerRef = useRef<HTMLDivElement>(null);
  const currentArea = areas.find((a) => a.id === activeAreaId) || areas[0];

  const threeRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    modelGroup: THREE.Group;
    controller: WalkthroughController;
    collisionSystem: CollisionSystem;
  } | null>(null);

  // Initialize Scene, Walkthrough Controller, and Collision
  const handleSceneReady = useCallback(
    async (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
      const collisionSystem = new CollisionSystem(currentArea.bounds);
      const controller = new WalkthroughController(
        camera,
        renderer.domElement,
        collisionSystem,
        currentArea.spawnPosition,
        currentArea.spawnRotationY
      );

      const modelGroup = new THREE.Group();
      scene.add(modelGroup);

      threeRef.current = {
        scene,
        camera,
        renderer,
        modelGroup,
        controller,
        collisionSystem,
      };

      try {
        setIsLoading(true);
        const gltfScene = await loadGLTFModel(currentArea.modelUrl, (pct) => setLoadProgress(pct));
        if (threeRef.current) {
          modelGroup.add(gltfScene);
        }
      } catch (err) {
        console.error("Failed to load walkthrough model:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [currentArea]
  );

  // Switch between interior areas (e.g. Guard Vestibule -> Central Courtyard)
  const handleSelectArea = (areaId: string) => {
    setActiveAreaId(areaId);
    if (onAreaChange) onAreaChange(areaId);

    const targetArea = areas.find((a) => a.id === areaId);
    if (!targetArea || !threeRef.current) return;

    threeRef.current.collisionSystem.setBounds(targetArea.bounds);
    threeRef.current.controller.setPosition(
      targetArea.spawnPosition[0],
      targetArea.spawnPosition[2],
      targetArea.spawnRotationY
    );

    setActiveHotspot(null);
  };

  // Render Loop Tick
  const handleRenderTick = useCallback(() => {
    if (!threeRef.current) return;
    const { controller, camera, renderer } = threeRef.current;

    controller.update();
    setIsLocked(controller.isLocked);

    // Project interior hotspots
    if (currentArea?.hotspots && currentArea.hotspots.length > 0) {
      const newPositions: Record<string, { x: number; y: number; visible: boolean }> = {};
      currentArea.hotspots.forEach((hotspot) => {
        newPositions[hotspot.id] = projectWorldToScreen(hotspot.position, camera);
      });
      setProjectedPositions(newPositions);
    }
  }, [currentArea]);

  // Request pointer lock on canvas click
  const handleCanvasClick = () => {
    if (threeRef.current?.controller) {
      threeRef.current.controller.requestPointerLock();
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (threeRef.current) {
        threeRef.current.controller.dispose();
        if (threeRef.current.modelGroup) {
          disposeHierarchy(threeRef.current.modelGroup);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none"
      onClick={handleCanvasClick}
    >
      <ModelCanvas
        onSceneReady={handleSceneReady}
        onRenderTick={handleRenderTick}
        lightingPreset={lightingPreset}
      />

      {isLoading && (
        <ModelLoadingState progress={loadProgress} monumentName={monumentName} />
      )}

      {/* Pointer Lock Overlay Indicator */}
      {!isLoading && !isLocked && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-[#181615]/95 border border-[#B18A55]/40 rounded-3xl p-6 text-center max-w-sm shadow-2xl pointer-events-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#282522] border border-[#3D3835] flex items-center justify-center mx-auto text-[#B18A55] mb-3">
              <MousePointer className="w-6 h-6" />
            </div>
            <h4 className="font-serif-editorial text-xl font-bold text-[#FAF4E5] mb-1">
              Click to Enter First-Person Mode
            </h4>
            <p className="text-xs text-[#A69E96] mb-4">
              Use <strong className="text-[#FAF4E5]">W, A, S, D</strong> or Arrow keys to walk. Move mouse to look around naturally. Press <kbd className="bg-[#282522] px-1.5 py-0.5 rounded border border-[#3D3835] text-[10px] text-[#FAF4E5]">ESC</kbd> to unlock cursor.
            </p>
            <button
              onClick={handleCanvasClick}
              className="px-5 py-2.5 rounded-xl bg-[#713C3C] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#8D4A4A] transition-colors shadow-lg"
            >
              Start Walkthrough
            </button>
          </div>
        </div>
      )}

      {/* Hotspots in Walkthrough */}
      {!isLoading && currentArea?.hotspots && (
        <ArchitecturalHotspots
          hotspots={currentArea.hotspots}
          projectedPositions={projectedPositions}
          activeHotspot={activeHotspot}
          onSelectHotspot={(h) => setActiveHotspot(h)}
          onCloseHotspot={() => setActiveHotspot(null)}
        />
      )}

      {/* Room & Area Navigation Wayfinding */}
      {!isLoading && areas.length > 1 && (
        <SceneNavigator
          areas={areas}
          currentAreaId={activeAreaId}
          onSelectArea={handleSelectArea}
        />
      )}

      {/* Crosshair when pointer is locked */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-sm" />
        </div>
      )}

      {/* Mobile Virtual Navigation Pad */}
      {!isLoading && (
        <div className="absolute bottom-6 right-6 flex sm:hidden flex-col items-center gap-1.5 z-30 bg-[#181615]/90 backdrop-blur-md p-2.5 rounded-2xl border border-[#3D3835] shadow-2xl">
          <button
            onPointerDown={() => threeRef.current?.controller.moveVirtual(1, 0)}
            className="w-10 h-10 rounded-xl bg-[#282522] active:bg-[#B18A55] text-white flex items-center justify-center font-bold"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            <button
              onPointerDown={() => threeRef.current?.controller.moveVirtual(0, -1)}
              className="w-10 h-10 rounded-xl bg-[#282522] active:bg-[#B18A55] text-white flex items-center justify-center font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onPointerDown={() => threeRef.current?.controller.moveVirtual(-1, 0)}
              className="w-10 h-10 rounded-xl bg-[#282522] active:bg-[#B18A55] text-white flex items-center justify-center font-bold"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onPointerDown={() => threeRef.current?.controller.moveVirtual(0, 1)}
              className="w-10 h-10 rounded-xl bg-[#282522] active:bg-[#B18A55] text-white flex items-center justify-center font-bold"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
