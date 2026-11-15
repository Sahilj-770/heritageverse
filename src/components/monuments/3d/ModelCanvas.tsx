"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { detectDeviceCapabilities } from "@/lib/3d/modelOptimizer";
import { LightingPreset } from "@/lib/3d/types";

interface ModelCanvasProps {
  onSceneReady: (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => void;
  onRenderTick?: () => void;
  lightingPreset?: LightingPreset;
  className?: string;
}

export function ModelCanvas({
  onSceneReady,
  onRenderTick,
  lightingPreset = "studio",
  className = "",
}: ModelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lightsRef = useRef<{
    ambient: THREE.AmbientLight;
    key: THREE.DirectionalLight;
    fill: THREE.DirectionalLight;
    rim: THREE.DirectionalLight;
  } | null>(null);

  const [webGLError, setWebGLError] = useState(false);

  const onRenderTickRef = useRef(onRenderTick);
  const onSceneReadyRef = useRef(onSceneReady);

  useEffect(() => {
    onRenderTickRef.current = onRenderTick;
  }, [onRenderTick]);

  useEffect(() => {
    onSceneReadyRef.current = onSceneReady;
  }, [onSceneReady]);

  // Apply lighting preset
  const updateLights = useCallback((preset: LightingPreset) => {
    if (!lightsRef.current) return;
    const { ambient, key, fill, rim } = lightsRef.current;

    switch (preset) {
      case "golden_hour":
        ambient.color.setHex(0xffdfba);
        ambient.intensity = 0.9;
        key.color.setHex(0xffaa5e);
        key.intensity = 2.4;
        key.position.set(30, 18, 30);
        fill.color.setHex(0xb18a55);
        fill.intensity = 0.7;
        rim.color.setHex(0x713c3c);
        rim.intensity = 0.9;
        break;

      case "midday_sun":
        ambient.color.setHex(0xffffff);
        ambient.intensity = 1.3;
        key.color.setHex(0xfffaed);
        key.intensity = 2.6;
        key.position.set(10, 45, 15);
        fill.color.setHex(0xd4cfc7);
        fill.intensity = 0.8;
        rim.color.setHex(0xa69e96);
        rim.intensity = 0.5;
        break;

      case "monsoon_diffuse":
        ambient.color.setHex(0xced8db);
        ambient.intensity = 1.6;
        key.color.setHex(0x9faeb2);
        key.intensity = 1.2;
        key.position.set(-10, 30, 20);
        fill.color.setHex(0x566063);
        fill.intensity = 0.5;
        rim.color.setHex(0x3d4345);
        rim.intensity = 0.4;
        break;

      case "studio":
      default:
        ambient.color.setHex(0xfff8f0);
        ambient.intensity = 1.2;
        key.color.setHex(0xffedd5);
        key.intensity = 2.0;
        key.position.set(22, 38, 26);
        fill.color.setHex(0xb18a55);
        fill.intensity = 0.9;
        rim.color.setHex(0x713c3c);
        rim.intensity = 0.7;
        break;
    }
  }, []);

  // Update lighting when preset prop changes (does NOT recreate WebGL canvas)
  useEffect(() => {
    updateLights(lightingPreset);
  }, [lightingPreset, updateLights]);

  // One-time WebGL initialization on mount
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let animFrame = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    const dev = detectDeviceCapabilities();

    try {
      const canvas = canvasRef.current;
      const width = canvas.clientWidth || 1000;
      const height = canvas.clientHeight || 600;

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: dev.antialias,
        powerPreference: dev.powerPreference,
        alpha: false,
      });

      renderer.setPixelRatio(dev.pixelRatio);
      renderer.setSize(width, height, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x151312);

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 14, 52);

      // Subtle Cadastral Plinth Ground Reference
      const grid = new THREE.GridHelper(90, 45, 0x5a4832, 0x24201c);
      const gridMat = grid.material as THREE.LineBasicMaterial;
      gridMat.opacity = 0.15;
      gridMat.transparent = true;
      grid.position.y = -1.82;
      scene.add(grid);

      // Studio Three-Point Lighting Setup
      const ambient = new THREE.AmbientLight(0xfff8f0, 1.2);
      scene.add(ambient);

      const key = new THREE.DirectionalLight(0xffedd5, 2.0);
      key.position.set(22, 38, 26);
      key.castShadow = true;
      key.shadow.mapSize.width = dev.shadowMapSize;
      key.shadow.mapSize.height = dev.shadowMapSize;
      key.shadow.camera.near = 0.5;
      key.shadow.camera.far = 120;
      key.shadow.camera.left = -35;
      key.shadow.camera.right = 35;
      key.shadow.camera.top = 35;
      key.shadow.camera.bottom = -35;
      key.shadow.bias = -0.0003;
      scene.add(key);

      const fill = new THREE.DirectionalLight(0xb18a55, 0.9);
      fill.position.set(-25, 22, -15);
      scene.add(fill);

      const rim = new THREE.DirectionalLight(0x713c3c, 0.7);
      rim.position.set(0, -10, 30);
      scene.add(rim);

      lightsRef.current = { ambient, key, fill, rim };
      updateLights(lightingPreset);

      if (onSceneReadyRef.current) {
        onSceneReadyRef.current(scene, camera, renderer);
      }

      // Render loop
      function loop() {
        animFrame = requestAnimationFrame(loop);
        if (onRenderTickRef.current) onRenderTickRef.current();
        if (renderer) renderer.render(scene, camera);
      }
      loop();

      // Resize observer
      const ro = new ResizeObserver(() => {
        if (!canvas || !renderer) return;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      });
      ro.observe(canvas);

      return () => {
        cancelAnimationFrame(animFrame);
        ro.disconnect();
        if (renderer) {
          renderer.dispose();
        }
      };
    } catch (err) {
      console.error("WebGL Initialization failed:", err);
      setWebGLError(true);
    }
  }, [updateLights]);

  if (webGLError) {
    return (
      <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-[#181615] p-8 text-center text-[#FAF4E5] rounded-3xl border border-[#3D3835]">
        <h4 className="font-serif-editorial text-xl font-bold text-[#FAF4E5] mb-2">
          3D Hardware Acceleration Unavailable
        </h4>
        <p className="text-xs text-[#A69E96] max-w-md">
          Your browser does not currently support WebGL rendering. Please enable hardware acceleration in your browser settings.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block outline-none" />
    </div>
  );
}
