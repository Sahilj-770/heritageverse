/**
 * HeritageVerse 3D Engine — Collision & Boundary System
 * Lightweight bounding box & wall collision detection preventing walk-throughs and out-of-bounds movement.
 */

export interface BoundingBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  floorY: number;
  ceilingY?: number;
}

export interface ObstacleBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  name?: string;
}

export class CollisionSystem {
  private bounds: BoundingBox;
  private obstacles: ObstacleBox[] = [];

  constructor(bounds: BoundingBox, obstacles: ObstacleBox[] = []) {
    this.bounds = bounds;
    this.obstacles = obstacles;
  }

  public setBounds(bounds: BoundingBox) {
    this.bounds = bounds;
  }

  public addObstacle(obs: ObstacleBox) {
    this.obstacles.push(obs);
  }

  public clearObstacles() {
    this.obstacles = [];
  }

  /**
   * Tests and clamps desired movement position with wall sliding
   */
  public resolvePosition(
    currentX: number,
    currentZ: number,
    desiredX: number,
    desiredZ: number,
    playerRadius: number = 0.4
  ): { x: number; z: number; isColliding: boolean } {
    let resolvedX = desiredX;
    let resolvedZ = desiredZ;
    let colliding = false;

    // 1. Boundary clamping
    if (resolvedX - playerRadius < this.bounds.minX) {
      resolvedX = this.bounds.minX + playerRadius;
      colliding = true;
    } else if (resolvedX + playerRadius > this.bounds.maxX) {
      resolvedX = this.bounds.maxX - playerRadius;
      colliding = true;
    }

    if (resolvedZ - playerRadius < this.bounds.minZ) {
      resolvedZ = this.bounds.minZ + playerRadius;
      colliding = true;
    } else if (resolvedZ + playerRadius > this.bounds.maxZ) {
      resolvedZ = this.bounds.maxZ - playerRadius;
      colliding = true;
    }

    // 2. Obstacle boxes (pillars, benches, fountain basins)
    for (const obs of this.obstacles) {
      const isInsideX =
        resolvedX + playerRadius > obs.minX && resolvedX - playerRadius < obs.maxX;
      const isInsideZ =
        resolvedZ + playerRadius > obs.minZ && resolvedZ - playerRadius < obs.maxZ;

      if (isInsideX && isInsideZ) {
        colliding = true;
        // Test X sliding only
        const canMoveX =
          currentZ + playerRadius <= obs.minZ || currentZ - playerRadius >= obs.maxZ;
        const canMoveZ =
          currentX + playerRadius <= obs.minX || currentX - playerRadius >= obs.maxX;

        if (canMoveX && !canMoveZ) {
          resolvedZ = currentZ;
        } else if (canMoveZ && !canMoveX) {
          resolvedX = currentX;
        } else {
          resolvedX = currentX;
          resolvedZ = currentZ;
        }
      }
    }

    return { x: resolvedX, z: resolvedZ, isColliding: colliding };
  }

  public get floorY(): number {
    return this.bounds.floorY;
  }
}
