/**
 * HeritageVerse 3D Engine — Model & Hardware Optimizer
 * Adapts pixel ratios, shadow map resolutions, and antialiasing based on client device capability.
 */

export interface DeviceTier {
  isMobile: boolean;
  pixelRatio: number;
  shadowMapSize: number;
  antialias: boolean;
  powerPreference: WebGLPowerPreference;
}

export function detectDeviceCapabilities(): DeviceTier {
  if (typeof window === "undefined") {
    return {
      isMobile: false,
      pixelRatio: 1,
      shadowMapSize: 1024,
      antialias: true,
      powerPreference: "default",
    };
  }

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

  const rawPixelRatio = window.devicePixelRatio || 1;
  // Cap mobile at 1.5 to preserve battery and 60fps, desktop at 2.0
  const pixelRatio = isMobile ? Math.min(rawPixelRatio, 1.5) : Math.min(rawPixelRatio, 2.0);

  return {
    isMobile,
    pixelRatio,
    shadowMapSize: isMobile ? 1024 : 2048,
    antialias: !isMobile,
    powerPreference: isMobile ? "default" : "high-performance",
  };
}
