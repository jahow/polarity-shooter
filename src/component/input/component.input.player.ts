import {
  GlobalInputState,
  hasPointerDown,
  isKeyPressed,
  KeyCode,
} from '../../utils/input';
import BaseInputComponent from './component.input.base';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import Entity from '../../entity/entity';
import TransformComponent from '../component.transform';
import BulletMeshComponent from '../mesh/component.mesh.bullet';
import { addEntity } from '../../app/app';
import BulletLogicComponent from '../logic/component.logic.bullet';
import PhysicsComponent from '../component.physics';
import { CollisionGroup, ImpostorType } from '../../system/system.physics';

export default class PlayerInputComponent extends BaseInputComponent {
  receiveInput(inputState: GlobalInputState, prevState: GlobalInputState) {
    const physics = this.entity.getComponent<PhysicsComponent>(
      PhysicsComponent
    );

    // speed falloff
    physics.velocity.scaleInPlace(0.6);

    // speed modification from input
    if (isKeyPressed(inputState, KeyCode.ArrowLeft)) {
      physics.velocity.addInPlace(Vector3.Left().scaleInPlace(0.3));
    }
    if (isKeyPressed(inputState, KeyCode.ArrowUp)) {
      physics.velocity.addInPlace(Vector3.Forward().scaleInPlace(0.3));
    }
    if (isKeyPressed(inputState, KeyCode.ArrowRight)) {
      physics.velocity.addInPlace(Vector3.Right().scaleInPlace(0.3));
    }
    if (isKeyPressed(inputState, KeyCode.ArrowDown)) {
      physics.velocity.addInPlace(Vector3.Backward().scaleInPlace(0.3));
    }
    if (physics.velocity.lengthSquared() > 1) {
      physics.velocity.normalize();
    }

    // scale
    physics.velocity.scaleInPlace(0.5);

    physics.forceAngle(
      Vector3.GetAngleBetweenVectors(
        Vector3.Right(),
        physics.velocity,
        Vector3.Up()
      )
    );

    // fire bullet
    if (hasPointerDown(inputState, true)) {
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
}
