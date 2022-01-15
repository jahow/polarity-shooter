import BaseControllerComponent from './component.controller.base';
import PhysicsComponent from '../component.physics';
import Entity from '../../entity/entity';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { removeEntity } from '../../app/entities';
import { Polarity } from '../../utils/polarity';
import ActorMeshComponent from '../mesh/component.mesh.actor';

export default class BulletControllerComponent extends BaseControllerComponent {
  private maxDist = 16;
  private start: Vector3;

  constructor(private polarity_: Polarity) {
    super();
  }

  attach(entity: Entity) {
    super.attach(entity);

    this.entity
      .getComponent<ActorMeshComponent>(ActorMeshComponent)
      .setPolarity(this.polarity_);

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

  get polarity() {
    return this.polarity_;
  }
}
