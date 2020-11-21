import { GlobalInputState, isKeyPressed, KeyCode } from '../utils/input';
import BaseInputComponent from './component.input.base';
import { Vector3 } from '@babylonjs/core';

export default class PlayerInputComponent extends BaseInputComponent {
  receiveInput(inputState: GlobalInputState, prevState: GlobalInputState) {
    const pos = this.transform.getPosition();
    if (isKeyPressed(inputState, KeyCode.ArrowLeft)) {
      pos.addInPlace(Vector3.Left().scaleInPlace(0.1));
    }
    if (isKeyPressed(inputState, KeyCode.ArrowUp)) {
      pos.addInPlace(Vector3.Forward().scaleInPlace(0.1));
    }
    if (isKeyPressed(inputState, KeyCode.ArrowRight)) {
      pos.addInPlace(Vector3.Right().scaleInPlace(0.1));
    }
    if (isKeyPressed(inputState, KeyCode.ArrowDown)) {
      pos.addInPlace(Vector3.Backward().scaleInPlace(0.1));
    }
  }
}
