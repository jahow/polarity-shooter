import BaseControllerComponent from './component.controller.base';
import PhysicsComponent from '../component.physics';
import Entity from '../../entity/entity';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { removeEntity } from '../../app/entities';

export default class BulletControllerComponent extends BaseControllerComponent {
  private maxDist = 16;
  private start: Vector3;

  attach(entity: Entity) {
    super.attach(entity);

    this.start = this.transform.getPosition().clone();

    const physics = this.entity.getComponent<PhysicsComponent>(
      PhysicsComponent
    );
    physics.velocity = this.transform.getNode().right;
  }

  postUpdate() {
    if (
      this.transform.getPosition().subtract(this.start).length() > this.maxDist
    ) {
      removeEntity(this.entity);
    }
  }
}
