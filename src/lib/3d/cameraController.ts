/**
 * HeritageVerse 3D Engine — Camera & Hotspot Projection Controller
 * Handles orbit navigation, smooth transitions to architectural details, and 3D-to-screen coordinate projection.
 */

import * as THREE from "three";

export interface OrbitState {
  azimuth: number; // in radians
  elevation: number; // in radians
  distance: number;
  target: THREE.Vector3;
}

export function projectWorldToScreen(
  worldPos: [number, number, number],
  camera: THREE.Camera
): { x: number; y: number; visible: boolean } {
  const v = new THREE.Vector3(worldPos[0], worldPos[1], worldPos[2]);
  v.project(camera);

  // Check if point is in front of camera frustum
  const visible = v.z < 1.0 && v.x >= -1.0 && v.x <= 1.0 && v.y >= -1.0 && v.y <= 1.0;

  const x = (v.x * 0.5 + 0.5) * 100;
  const y = (-(v.y * 0.5) + 0.5) * 100;

  return { x, y, visible };
}

export class SmoothCameraController {
  private camera: THREE.PerspectiveCamera;
  private currentPos: THREE.Vector3;
  private targetPos: THREE.Vector3;
  private currentLookAt: THREE.Vector3;
  private targetLookAt: THREE.Vector3;
  private isTransitioning: boolean = false;
  private transitionSpeed: number = 0.08;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.currentPos = camera.position.clone();
    this.targetPos = camera.position.clone();
    this.currentLookAt = new THREE.Vector3(0, 5, 0);
    this.targetLookAt = new THREE.Vector3(0, 5, 0);
  }

  public flyTo(
    newPosition: [number, number, number],
    newTarget: [number, number, number],
    speed = 0.08
  ) {
    this.targetPos.set(newPosition[0], newPosition[1], newPosition[2]);
    this.targetLookAt.set(newTarget[0], newTarget[1], newTarget[2]);
    this.transitionSpeed = speed;
    this.isTransitioning = true;
  }

  public reset(defaultPosition: [number, number, number] = [0, 16, 36], defaultTarget: [number, number, number] = [0, 5, 0]) {
    this.flyTo(defaultPosition, defaultTarget, 0.06);
  }

  public update(): boolean {
    if (!this.isTransitioning) return false;

    this.currentPos.lerp(this.targetPos, this.transitionSpeed);
    this.currentLookAt.lerp(this.targetLookAt, this.transitionSpeed);

    this.camera.position.copy(this.currentPos);
    this.camera.lookAt(this.currentLookAt);

    if (
      this.currentPos.distanceTo(this.targetPos) < 0.05 &&
      this.currentLookAt.distanceTo(this.targetLookAt) < 0.05
    ) {
      this.camera.position.copy(this.targetPos);
      this.camera.lookAt(this.targetLookAt);
      this.isTransitioning = false;
    }

    return true;
  }

  public get isMoving(): boolean {
    return this.isTransitioning;
  }
}
