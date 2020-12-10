import BaseControllerComponent from './component.controller.base';
import Entity from '../../entity/entity';
import { addEntity, removeEntity } from '../../app/entities';
import BulletControllerComponent from './component.controller.bullet';
import PhysicsComponent from '../component.physics';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Prefabs } from '../../data/prefabs';
import throttle from 'lodash/throttle';
import ActorMeshComponent from '../mesh/component.mesh.actor';
import { CollisionGroup } from '../../system/system.physics';
import PlayerInputComponent from '../input/component.input.player';
import { Polarity } from '../../utils/polarity';

export default class ActorControllerComponent extends BaseControllerComponent {
  physics: PhysicsComponent;
  mesh: ActorMeshComponent;
  maxSpeed = 0.3;
  targetAngle = 0;
  swayUp = Vector3.Zero();
  polarity_: Polarity;

  constructor(
    private bulletCollisionGroup: CollisionGroup,
    private shotRateLimit = 100,
    private shotSpeed = 0.8,
    polarity?: Polarity
  ) {
    super();

    this.polarity_ = polarity;
  }

  attach(entity: Entity) {
    super.attach(entity);
    this.physics = this.entity.getComponent<PhysicsComponent>(PhysicsComponent);
    this.mesh = this.entity.getComponent<ActorMeshComponent>(
      ActorMeshComponent
    );

    if (this.polarity_ !== undefined) {
      this.polarity = this.polarity_;
    }
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
    if (
      collider.hasComponent(BulletControllerComponent) &&
      !this.entity.hasComponent(PlayerInputComponent)
    ) {
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
    this.targetAngle = Vector3.GetAngleBetweenVectors(
      Vector3.Right(),
      point.subtract(this.transform.getPosition()),
      Vector3.Up()
    );
  }

  turnTowards(direction: Vector3) {
    this.targetAngle = Vector3.GetAngleBetweenVectors(
      Vector3.Right(),
      direction,
      Vector3.Up()
    );
  }

  fireBullet = throttle(
    () => {
      const pos = this.transform
        .getPosition()
        .add(this.mesh.getActorMesh().right.scaleInPlace(0.6));
      const bullet = Prefabs.Bullet(
        pos,
        new Vector3(0, this.targetAngle, 0),
        this.polarity
      );
      const bulletPhysics = bullet.getComponent<PhysicsComponent>(
        PhysicsComponent
      );
      bulletPhysics.group = this.bulletCollisionGroup;
      bulletPhysics.setVelocityMagnitude(this.shotSpeed);
      addEntity(bullet);
    },
    this.shotRateLimit,
    { leading: true, trailing: false }
  );

  get polarity() {
    return this.polarity_;
  }

  set polarity(value) {
    this.polarity_ = value;
    this.mesh.setPolarity(value);
  }
}
