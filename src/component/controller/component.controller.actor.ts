import BaseControllerComponent from './component.controller.base';
import Entity from '../../entity/entity';
import { addEntity, removeEntity } from '../../app/app';
import BulletControllerComponent from './component.controller.bullet';
import PhysicsComponent from '../component.physics';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Prefabs } from '../../data/prefabs';
import throttle from 'lodash/throttle';
import ActorMeshComponent from '../mesh/component.mesh.actor';

export default class ActorControllerComponent extends BaseControllerComponent {
  physics: PhysicsComponent;
  mesh: ActorMeshComponent;
  maxSpeed = 0.3;
  shotRateLimit = 100;
  targetAngle = 0;
  swayUp = Vector3.Zero();

  attach(entity: Entity) {
    super.attach(entity);
    this.physics = this.entity.getComponent<PhysicsComponent>(PhysicsComponent);
    this.mesh = this.entity.getComponent<ActorMeshComponent>(
      ActorMeshComponent
    );
  }

  update() {
    // speed falloff
    this.physics.velocity.scaleInPlace(0.5);

    // rotate actor mesh to target angle
    this.mesh.getActorMesh().rotation.y =
      -this.transform.getRotation().y + this.targetAngle;
    this.physics.forceAngle(this.targetAngle);

    // rotate actor mesh according to sway amount
    this.swayUp.x -= this.physics.velocity.z * 0.3;
    this.swayUp.x *= 0.9;
    this.swayUp.z -= this.physics.velocity.x * 0.3;
    this.swayUp.z *= 0.9;
    this.mesh.actorMesh.rotation.x =
      Math.cos(this.targetAngle) * this.swayUp.x +
      Math.sin(this.targetAngle) * this.swayUp.z;
    this.mesh.actorMesh.rotation.z =
      -Math.cos(this.targetAngle) * this.swayUp.z +
      Math.sin(this.targetAngle) * this.swayUp.x;
  }

  collided(collider: Entity) {
    // bullets kill me
    if (collider.hasComponent(BulletControllerComponent)) {
      removeEntity(this.entity);
    }
  }

  moveTowards(direction: Vector3) {
    this.physics.velocity.addInPlace(direction.normalize().scaleInPlace(0.3));
    const length = this.physics.velocity.length();
    if (length > this.maxSpeed) {
      this.physics.velocity.scaleInPlace(this.maxSpeed / length);
    }
    this.swayAmount += 0.1;
  }

  turnTo(point: Vector3) {
    this.targetAngle = Vector3.GetAngleBetweenVectors(
      Vector3.Right(),
      point.subtract(this.transform.getPosition()),
      Vector3.Up()
    );
  }

  fireBullet = throttle(
    () => {
      const pos = this.transform
        .getPosition()
        .add(this.mesh.getActorMesh().right.scaleInPlace(0.6));
      const bullet = Prefabs.Bullet(pos, new Vector3(0, this.targetAngle, 0));
      addEntity(bullet);
    },
    this.shotRateLimit,
    { leading: true, trailing: false }
  );
}
