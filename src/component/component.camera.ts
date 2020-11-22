import BaseComponent from './component.base';
import { UniversalCamera, Vector3 } from '@babylonjs/core';
import Entity from '../entity/entity';
import { getScene } from '../app/engine';

export default class CameraComponent extends BaseComponent {
  private readonly camera_: UniversalCamera;
  private target_: Entity;
  private position_: Vector3;

  constructor(position: Vector3, target?: Entity) {
    super();
    this.camera_ = new UniversalCamera('camera', Vector3.Zero(), getScene());
    this.position = position;
    if (target) this.target = target;
  }

  get camera() {
    return this.camera_;
  }

  get target() {
    return this.target_;
  }

  set target(e: Entity) {
    this.target_ = e;
  }

  get position() {
    return this.position_;
  }

  set position(p: Vector3) {
    this.position_ = p;
  }

  updateCamera() {
    this.camera.position = this.target
      .getTransform()
      .getPosition()
      .add(this.position);
    this.camera.target = this.target.getTransform().getPosition();
  }
}
