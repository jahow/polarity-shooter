import BaseComponent from './component.base';
import Entity from '../entity/entity';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import {
  CollisionGroup,
  ImpostorSize,
  ImpostorType,
} from '../system/system.physics';

export interface Impostor {
  type: ImpostorType;
  size: ImpostorSize;
  center?: Vector3;
  collides?: boolean;
}

export default class PhysicsComponent extends BaseComponent {
  private impostor: Impostor;
  private velocity_ = Vector3.Zero();
  private angle_: number | null = null; // null means the angle is not forced

  constructor(private group_: CollisionGroup, impostor_: Impostor) {
    super();

    this.impostor = {
      collides: true,
      center: Vector3.Zero(),
      ...impostor_,
    };
  }

  get group() {
    return this.group_;
  }

  get type() {
    return this.impostor.type;
  }

  // todo: support this?
  get center() {
    return this.impostor.center;
  }

  get size() {
    return this.impostor.size;
  }

  get collides() {
    return this.impostor.collides;
  }

  get velocity() {
    return this.velocity_;
  }

  set velocity(velocity: Vector3) {
    this.velocity_ = velocity;
  }

  get angle() {
    return this.angle_ !== null ? this.angle_ : this.transform.getRotation().y;
  }

  forceAngle(angle: number) {
    this.angle_ = angle;
  }

  isAngleForced() {
    return this.angle_ !== null;
  }
}
