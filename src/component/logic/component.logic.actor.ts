import BaseLogicComponent from './component.logic.base';
import Entity from '../../entity/entity';
import { addEntity, removeEntity } from '../../app/app';
import BulletLogicComponent from './component.logic.bullet';
import TransformComponent from '../component.transform';
import BulletMeshComponent from '../mesh/component.mesh.bullet';
import PhysicsComponent from '../component.physics';
import { CollisionGroup, ImpostorType } from '../../system/system.physics';

export default class ActorLogicComponent extends BaseLogicComponent {
  update() {}

  collided(collider: Entity) {
    // bullets kill me
    if (collider.hasComponent(BulletLogicComponent)) {
      removeEntity(this.entity);
    }
  }

  fireBullet() {
    const bullet = new Entity([
      new TransformComponent(
        this.transform.getPosition(),
        this.transform.getRotation()
      ),
      new BulletMeshComponent(),
      new BulletLogicComponent(),
      new PhysicsComponent(CollisionGroup.PLAYER_BULLET, {
        type: ImpostorType.CYLINDER,
        size: 0.3,
        collides: false,
      }),
    ]);
    addEntity(bullet);
  }
}
