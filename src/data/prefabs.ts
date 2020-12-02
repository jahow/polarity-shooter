import Entity from '../entity/entity';
import TransformComponent from '../component/component.transform';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import ActorMeshComponent from '../component/mesh/component.mesh.actor';
import PlayerInputComponent from '../component/input/component.input.player';
import PhysicsComponent from '../component/component.physics';
import { CollisionGroup, ImpostorType } from '../system/system.physics';
import ActorControllerComponent from '../component/controller/component.controller.actor';
import Mesh from '../utils/mesh';
import BulletControllerComponent from '../component/controller/component.controller.bullet';

export const Prefabs = {
  Player: (pos: Vector3, rotation?: Vector3) =>
    new Entity([
      new TransformComponent(pos, rotation),
      new ActorMeshComponent(() =>
        new Mesh('[actor] player')
          .pushCube([0, 0, 0], [0.4, 0.2, 0.4])
          .pushCube([0.2, 0, 0.2], [0.2, 0.1, 0.2])
          .pushCube([0.35, 0, 0.15], [0.1, 0.1, 0.2])
          .pushCube([0.2, 0, -0.2], [0.2, 0.1, 0.2])
          .pushCube([0.35, 0, -0.15], [0.1, 0.1, 0.2])
          .pushCube([0.25, 0, 0], [0.2, 0.3, 0.1])
          .pushCube([-0.15, 0, 0.2], [0.3, 0.3, 0.2])
          .pushCube([-0.35, 0, 0.25], [0.1, 0.2, 0.1])
          .pushCube([-0.15, 0, -0.2], [0.3, 0.3, 0.2])
          .pushCube([-0.35, 0, -0.25], [0.1, 0.2, 0.1])
          .pushCube([-0.25, 0, 0], [0.1, 0.2, 0.1])
          .commit()
      ),
      new PlayerInputComponent(),
      new PhysicsComponent(CollisionGroup.PLAYER, {
        type: ImpostorType.BOX,
        size: [0.8, 0.6],
      }),
      new ActorControllerComponent(),
    ]),
  Enemy: (pos: Vector3, rotation?: Vector3) =>
    new Entity([
      new TransformComponent(pos, rotation),
      new ActorMeshComponent(() =>
        new Mesh('[actor] enemy')
          .pushCube([-0.05, 0, 0], [0.3, 0.2, 0.6])
          .pushCube([0.1, 0.05, 0.075], [0.1, 0.2, 0.05])
          .pushCube([0.1, 0.05, -0.075], [0.1, 0.2, 0.05])
          .pushCube([0.1, 0.1, -0.225], [0.3, 0.2, 0.25])
          .pushCube([0.275, 0.075, -0.15], [0.15, 0.15, 0.1])
          .pushCube([0.375, 0.05, -0.15], [0.05, 0.1, 0.1])
          .pushCube([0.1, -0.075, 0.325], [0.2, 0.15, 0.15])
          .pushCube([0.25, -0.075, 0.3], [0.1, 0.15, 0.1])
          .pushCube([-0.2, -0.075, 0.275], [0.2, 0.15, 0.15])
          .pushCube([-0.25, -0.075, 0.35], [0.1, 0.15, 0.1])
          .pushCube([-0.275, -0.075, -0.225], [0.15, 0.15, 0.25])
          .pushCube([-0.35, -0.075, -0.2], [0.1, 0.15, 0.1])
          .commit()
      ),
      new PhysicsComponent(CollisionGroup.ENEMY, {
        type: ImpostorType.BOX,
        size: 0.8,
      }),
      new ActorControllerComponent(),
    ]),
  Bullet: (pos: Vector3, rotation?: Vector3) =>
    new Entity([
      new TransformComponent(pos, rotation),
      new ActorMeshComponent(() =>
        new Mesh('[actor] bullet')
          .pushQuad([-0.9, 0, -0.1], [1, 0, 0], [0, 0, 0.2])
          .commit()
      ),
      new BulletControllerComponent(),
      new PhysicsComponent(CollisionGroup.PLAYER_BULLET, {
        type: ImpostorType.CYLINDER,
        size: 0.3,
        collides: false,
      }),
    ]),
};
