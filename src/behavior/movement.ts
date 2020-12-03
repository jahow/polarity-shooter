import { BaseBehavior } from './base';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import ActorControllerComponent from '../component/controller/component.controller.actor';

export class RotateBehavior extends BaseBehavior {
  private center_ = Vector3.Zero();
  private radius_ = 10;

  get center() {
    return this.center_;
  }

  set center(p: Vector3) {
    this.center_ = p.clone();
  }

  get radius(): number {
    return this.radius_;
  }

  set radius(value: number) {
    this.radius_ = value;
  }

  apply(controller: ActorControllerComponent) {
    super.apply(controller);

    const pos = controller.transform.getPosition();
    const diff = pos.subtract(this.center);
    const distance = diff.length();
    diff.normalize();
    const tangent = new Vector3(-diff.z, 0, diff.x);
    tangent.addInPlace(diff.scaleInPlace(this.radius - distance));

    controller.moveTowards(tangent);
  }
}
