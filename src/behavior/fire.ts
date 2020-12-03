import { BaseBehavior } from './base';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import ActorControllerComponent from '../component/controller/component.controller.actor';

export class DirectionalFireBehavior extends BaseBehavior {
  private _direction: Vector3;
  private _firing = false;

  get firing(): boolean {
    return this._firing;
  }

  set firing(value: boolean) {
    this._firing = value;
  }

  get direction(): Vector3 {
    return this._direction;
  }

  set direction(value: Vector3) {
    this._direction = value.clone();
  }

  apply(controller: ActorControllerComponent) {
    super.apply(controller);

    controller.turnTowards(this.direction);
    if (this.firing) {
      controller.fireBullet();
    }
  }
}
