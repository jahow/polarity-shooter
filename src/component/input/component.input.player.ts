import {
  GlobalInputState,
  hasPointerDown,
  isKeyPressed,
  KeyCode,
} from '../../utils/input';
import BaseInputComponent from './component.input.base';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import PhysicsComponent from '../component.physics';
import ActorLogicComponent from '../logic/component.logic.actor';

export default class PlayerInputComponent extends BaseInputComponent {
  receiveInput(inputState: GlobalInputState, prevState: GlobalInputState) {
    const physics = this.entity.getComponent<PhysicsComponent>(
      PhysicsComponent
    );
    const logic = this.entity.getComponent<ActorLogicComponent>(
      ActorLogicComponent
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

    physics.velocity.scaleInPlace(0.5);
    if (physics.velocity.lengthSquared() < 0.001) {
      physics.velocity = Vector3.Zero();
    } else {
      physics.forceAngle(
        Vector3.GetAngleBetweenVectors(
          Vector3.Right(),
          physics.velocity,
          Vector3.Up()
        )
      );
    }

    // fire bullet
    if (hasPointerDown(inputState, true)) {
      logic.fireBullet();
    }
  }
}
