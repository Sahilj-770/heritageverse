/**
 * HeritageVerse 3D Engine — Model Loader
 * High-performance GLTF/GLB loader with PBR setup, sRGB encoding, caching, and clean disposal.
 */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Global cache for loaded GLTF scenes to avoid re-fetching
const modelCache = new Map<string, THREE.Group>();

export async function loadGLTFModel(
  url: string,
  onProgress?: (percent: number) => void
): Promise<THREE.Group> {
  if (modelCache.has(url)) {
    const cached = modelCache.get(url)!;
    return cached.clone(true);
  }

  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const root = gltf.scene;

        // Traverse and optimize meshes, materials, and shadows
        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              materials.forEach((mat) => {
                if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                  const standardMat = mat as THREE.MeshStandardMaterial;
                  if (standardMat.map) {
                    standardMat.map.colorSpace = THREE.SRGBColorSpace;
                    standardMat.map.generateMipmaps = true;
                  }
                  standardMat.needsUpdate = true;
                }
              });
            }
          }
        });

        modelCache.set(url, root);
        resolve(root.clone(true));
      },
      (xhr) => {
        if (onProgress && xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          onProgress(percent);
        }
      },
      (error) => {
        console.error(`Error loading 3D model from ${url}:`, error);
        reject(error);
      }
    );
  });
}

/**
 * Deep disposal of Three.js object hierarchies to prevent WebGL memory leaks
 */
export function disposeHierarchy(object: THREE.Object3D) {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      if (mesh.material) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((mat) => {
          // Dispose textures
          Object.keys(mat).forEach((prop) => {
            const val = (mat as unknown as Record<string, unknown>)[prop];
            if (val && typeof val === "object" && (val as THREE.Texture).isTexture) {
              (val as THREE.Texture).dispose();
            }
          });
          mat.dispose();
        });
      }
    }
  });
}
