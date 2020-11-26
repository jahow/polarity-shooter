import BaseLogicComponent from './component.logic.base';
import Entity from '../../entity/entity';
import { addEntity, removeEntity } from '../../app/app';
import BulletLogicComponent from './component.logic.bullet';
import TransformComponent from '../component.transform';
import BulletMeshComponent from '../mesh/component.mesh.bullet';
import PhysicsComponent from '../component.physics';
import { CollisionGroup, ImpostorType } from '../../system/system.physics';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

export default class ActorLogicComponent extends BaseLogicComponent {
  physics: PhysicsComponent;
  maxSpeed = 0.4;

  attach(entity: Entity) {
    super.attach(entity);
    this.physics = this.entity.getComponent<PhysicsComponent>(PhysicsComponent);
  }

  update() {
    // speed falloff
    this.physics.velocity.scaleInPlace(0.5);
  }

  collided(collider: Entity) {
    // bullets kill me
    if (collider.hasComponent(BulletLogicComponent)) {
      removeEntity(this.entity);
    }
  }

  moveTowards(direction: Vector3) {
    this.physics.velocity.addInPlace(direction.normalize().scaleInPlace(0.3));
    const length = this.physics.velocity.length();
    if (length > this.maxSpeed) {
      this.physics.velocity.scaleInPlace(this.maxSpeed / length);
    }
  }

  turnTo(point: Vector3) {
    this.physics.forceAngle(
      Vector3.GetAngleBetweenVectors(
        Vector3.Right(),
        point.subtract(this.transform.getPosition()),
        Vector3.Up()
      )
    );
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
