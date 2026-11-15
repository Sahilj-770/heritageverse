import type { NextConfig } from "next";

const securityHeaders = [
  // 1. Prevent MIME-sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // 2. Prevent Clickjacking attacks
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // 3. Control Referrer Information leakage
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // 4. Restrict dangerous browser device APIs
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
  // 5. Enforce Strict HTTPS (HSTS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // 6. Cross-Origin Embedder Policy for WebGL & Panorama Textures
  {
    key: "Cross-Origin-Embedder-Policy",
    value: "unsafe-none",
  },
  // 7. Cross-Origin Opener Policy
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
  // 8. Robust Content Security Policy (permitting WebGL, WebAssembly, Web Workers, Cesium, and MapLibre)
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https: blob:",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' blob: data: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https: blob: data: wss:",
      "worker-src 'self' blob:",
      "media-src 'self' blob: data: https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow external panorama images for Three.js texture loading
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pannellum.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
