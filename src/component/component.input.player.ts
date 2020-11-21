import { GlobalInputState, isKeyPressed, KeyCode } from '../utils/input';
import BaseInputComponent from './component.input.base';
import { Vector3 } from '@babylonjs/core';

export default class PlayerInputComponent extends BaseInputComponent {
  private speedVector = Vector3.Zero();

  receiveInput(inputState: GlobalInputState, prevState: GlobalInputState) {
    // speed falloff
    this.speedVector.scaleInPlace(0.6);

    // speed modification from input
    if (isKeyPressed(inputState, KeyCode.ArrowLeft)) {
      this.speedVector.addInPlace(Vector3.Left().scaleInPlace(0.3));
    }
    if (isKeyPressed(inputState, KeyCode.ArrowUp)) {
      this.speedVector.addInPlace(Vector3.Forward().scaleInPlace(0.3));
    }
    if (isKeyPressed(inputState, KeyCode.ArrowRight)) {
      this.speedVector.addInPlace(Vector3.Right().scaleInPlace(0.3));
    }
    if (isKeyPressed(inputState, KeyCode.ArrowDown)) {
      this.speedVector.addInPlace(Vector3.Backward().scaleInPlace(0.3));
    }
    if (this.speedVector.lengthSquared() > 1) {
      this.speedVector.normalize();
    }

    // apply to position
    this.transform.getPosition().addInPlace(this.speedVector.scale(0.15));

    // set rotation to face speed vector
    this.transform.setRotation(
      new Vector3(
        0,
        Vector3.GetAngleBetweenVectors(
          Vector3.Forward(),
          this.speedVector,
          Vector3.Up()
        ),
        0
      )
    );
  }
}
