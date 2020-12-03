import BaseControllerComponent from './component.controller.base';
import PhysicsComponent from '../component.physics';
import Entity from '../../entity/entity';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { removeEntity } from '../../app/entities';

export default class BulletControllerComponent extends BaseControllerComponent {
  private speed = 0.8;
  private maxDist = 16;
  private start: Vector3;

  attach(entity: Entity) {
    super.attach(entity);

    this.start = this.transform.getPosition().clone();

    const heading = this.transform.getNode().right;
    const physics = this.entity.getComponent<PhysicsComponent>(
      PhysicsComponent
    );
    physics.velocity = heading.scaleInPlace(this.speed);
  }

  postUpdate() {
    if (
      this.transform.getPosition().subtract(this.start).length() > this.maxDist
    ) {
      removeEntity(this.entity);
    }
  }
}
