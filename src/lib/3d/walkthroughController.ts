/**
 * HeritageVerse 3D Engine — First-Person Walkthrough Controller
 * Implements FPS camera movement, WASD keyboard inputs, pointer lock, mobile touch, and collision clamping.
 */

import * as THREE from "three";
import { CollisionSystem } from "./collisionSystem";

export interface WalkthroughInputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

export class WalkthroughController {
  private camera: THREE.PerspectiveCamera;
  private collisionSystem: CollisionSystem;
  private domElement: HTMLElement;

  // Orientation
  private yaw: number = 0; // horizontal angle
  private pitch: number = 0; // vertical angle (-85° to 85°)

  // Position and velocity
  public position: THREE.Vector3;
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private eyeHeight: number = 1.65; // standard human eye level (meters)

  // Input state
  private keys: WalkthroughInputState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  private isPointerLocked: boolean = false;
  private moveSpeed: number = 3.2; // meters/sec
  private friction: number = 0.88;

  // Touch tracking for mobile
  private touchStart: { x: number; y: number } | null = null;

  constructor(
    camera: THREE.PerspectiveCamera,
    domElement: HTMLElement,
    collisionSystem: CollisionSystem,
    initialPos: [number, number, number] = [0, 1.65, 10],
    initialYaw: number = Math.PI
  ) {
    this.camera = camera;
    this.domElement = domElement;
    this.collisionSystem = collisionSystem;
    this.position = new THREE.Vector3(initialPos[0], collisionSystem.floorY + this.eyeHeight, initialPos[2]);
    this.yaw = initialYaw;

    this.bindEvents();
    this.updateCameraOrientation();
  }

  private bindEvents() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    document.addEventListener("pointerlockchange", this.onPointerLockChange);
    this.domElement.addEventListener("mousemove", this.onMouseMove);

    // Touch controls
    this.domElement.addEventListener("touchstart", this.onTouchStart, { passive: false });
    this.domElement.addEventListener("touchmove", this.onTouchMove, { passive: false });
    this.domElement.addEventListener("touchend", this.onTouchEnd);
  }

  public dispose() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    document.removeEventListener("pointerlockchange", this.onPointerLockChange);
    this.domElement.removeEventListener("mousemove", this.onMouseMove);

    this.domElement.removeEventListener("touchstart", this.onTouchStart);
    this.domElement.removeEventListener("touchmove", this.onTouchMove);
    this.domElement.removeEventListener("touchend", this.onTouchEnd);
  }

  public requestPointerLock() {
    this.domElement.requestPointerLock();
  }

  public exitPointerLock() {
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
  }

  private onPointerLockChange = () => {
    this.isPointerLocked = document.pointerLockElement === this.domElement;
  };

  private onKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        this.keys.forward = true;
        break;
      case "KeyS":
      case "ArrowDown":
        this.keys.backward = true;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.keys.left = true;
        break;
      case "KeyD":
      case "ArrowRight":
        this.keys.right = true;
        break;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        this.keys.forward = false;
        break;
      case "KeyS":
      case "ArrowDown":
        this.keys.backward = false;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.keys.left = false;
        break;
      case "KeyD":
      case "ArrowRight":
        this.keys.right = false;
        break;
    }
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isPointerLocked) return;

    const sensitivity = 0.0022;
    this.yaw -= e.movementX * sensitivity;
    this.pitch -= e.movementY * sensitivity;

    // Clamp pitch between -80 and +80 degrees
    const maxPitch = (80 * Math.PI) / 180;
    this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));

    this.updateCameraOrientation();
  };

  private onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      this.touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    if (!this.touchStart || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - this.touchStart.x;
    const dy = e.touches[0].clientY - this.touchStart.y;
    this.touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    const sensitivity = 0.004;
    this.yaw -= dx * sensitivity;
    this.pitch -= dy * sensitivity;

    const maxPitch = (80 * Math.PI) / 180;
    this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));

    this.updateCameraOrientation();
  };

  private onTouchEnd = () => {
    this.touchStart = null;
  };

  private updateCameraOrientation() {
    const cosPitch = Math.cos(this.pitch);
    const lookDir = new THREE.Vector3(
      Math.sin(this.yaw) * cosPitch,
      Math.sin(this.pitch),
      Math.cos(this.yaw) * cosPitch
    );

    this.camera.position.copy(this.position);
    this.camera.lookAt(this.position.clone().add(lookDir));
  }

  public setPosition(x: number, z: number, yaw?: number) {
    this.position.set(x, this.collisionSystem.floorY + this.eyeHeight, z);
    if (yaw !== undefined) this.yaw = yaw;
    this.velocity.set(0, 0, 0);
    this.updateCameraOrientation();
  }

  public moveVirtual(forward: number, strafe: number) {
    const forwardVec = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
    const rightVec = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    const moveVector = new THREE.Vector3();
    if (forward !== 0) moveVector.add(forwardVec.multiplyScalar(forward));
    if (strafe !== 0) moveVector.add(rightVec.multiplyScalar(strafe));

    if (moveVector.lengthSq() > 0) {
      moveVector.normalize().multiplyScalar(this.moveSpeed * 0.02);
      this.applyMovement(moveVector.x, moveVector.z);
    }
  }

  private applyMovement(deltaX: number, deltaZ: number) {
    const currentX = this.position.x;
    const currentZ = this.position.z;

    const targetX = currentX + deltaX;
    const targetZ = currentZ + deltaZ;

    const resolved = this.collisionSystem.resolvePosition(currentX, currentZ, targetX, targetZ);
    this.position.x = resolved.x;
    this.position.z = resolved.z;
    this.position.y = this.collisionSystem.floorY + this.eyeHeight;

    this.updateCameraOrientation();
  }

  public update(deltaSeconds: number = 0.016) {
    const forwardVec = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
    const rightVec = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    const accel = new THREE.Vector3();

    if (this.keys.forward) accel.add(forwardVec);
    if (this.keys.backward) accel.sub(forwardVec);
    if (this.keys.right) accel.add(rightVec);
    if (this.keys.left) accel.sub(rightVec);

    if (accel.lengthSq() > 0) {
      accel.normalize().multiplyScalar(this.moveSpeed * deltaSeconds);
      this.velocity.add(accel);
    }

    this.velocity.multiplyScalar(this.friction);

    if (this.velocity.lengthSq() > 0.00001) {
      this.applyMovement(this.velocity.x, this.velocity.z);
    }
  }

  public get isLocked(): boolean {
    return this.isPointerLocked;
  }
}
