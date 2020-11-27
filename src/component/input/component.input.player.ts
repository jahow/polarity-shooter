import {
  getFirstPointer,
  getProjectedPointerPosition,
  GlobalInputState,
  hasPointerDown,
  isKeyPressed,
  KeyCode,
} from '../../utils/input';
import BaseInputComponent from './component.input.base';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import ActorLogicComponent from '../logic/component.logic.actor';
import { getActiveCamera } from '../../system/system.render';

export default class PlayerInputComponent extends BaseInputComponent {
  receiveInput(inputState: GlobalInputState, prevState: GlobalInputState) {
    const logic = this.entity.getComponent<ActorLogicComponent>(
      ActorLogicComponent
    );

    // direction vector
    const dir = Vector3.Zero();

    // speed modification from input
    if (isKeyPressed(inputState, KeyCode.ArrowLeft)) {
      dir.x -= 1;
    }
    if (isKeyPressed(inputState, KeyCode.ArrowUp)) {
      dir.z += 1;
    }
    if (isKeyPressed(inputState, KeyCode.ArrowRight)) {
      dir.x += 1;
    }
    if (isKeyPressed(inputState, KeyCode.ArrowDown)) {
      dir.z -= 1;
    }

    if (dir.x || dir.z) logic.moveTowards(dir);

    const pointer = getFirstPointer(inputState);
    if (pointer && getActiveCamera()) {
      const projected = getProjectedPointerPosition(
        pointer,
        getActiveCamera().camera
      );
      logic.turnTo(projected);
    }

    // fire bullet
    if (hasPointerDown(inputState)) {
      logic.fireBullet();
    }
  }
}
