import BaseLogicComponent from './component.logic.base';
import Entity from '../../entity/entity';
import { addEntity, removeEntity } from '../../app/app';
import BulletLogicComponent from './component.logic.bullet';
import PhysicsComponent from '../component.physics';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Prefabs } from '../../data/prefabs';
import throttle from 'lodash/throttle';

export default class ActorLogicComponent extends BaseLogicComponent {
  physics: PhysicsComponent;
  maxSpeed = 0.4;
  shotRateLimit = 100;

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

  fireBullet = throttle(
    () => {
      const pos = this.transform
        .getPosition()
        .add(this.transform.getHeading().scaleInPlace(0.6));
      const bullet = Prefabs.Bullet(pos, this.transform.getRotation());
      addEntity(bullet);
    },
    this.shotRateLimit,
    { leading: true, trailing: false }
  );
}
