import BaseInputComponent from './component.input.base';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import ActorControllerComponent from '../controller/component.controller.actor';
import { getActiveCamera } from '../../system/system.render';
import { opposite } from '../../utils/polarity';
import {
  getKeyValue,
  getProjectedPointerPosition,
  isKeyPressed,
} from '../../utils/input';
import { GlobalInputState } from '../../utils/input/model';

export default class PlayerInputComponent extends BaseInputComponent {
  receiveInput(inputState: GlobalInputState, prevState: GlobalInputState) {
    const logic = this.entity.getComponent<ActorControllerComponent>(
      ActorControllerComponent
    );

    // direction vector
    const dir = Vector3.Zero();

    // speed modification from input
    if (isKeyPressed(inputState, 'left')) {
      dir.x -= getKeyValue(inputState, 'left');
    }
    if (isKeyPressed(inputState, 'up')) {
      dir.z += getKeyValue(inputState, 'up');
    }
    if (isKeyPressed(inputState, 'right')) {
      dir.x += getKeyValue(inputState, 'right');
    }
    if (isKeyPressed(inputState, 'down')) {
      dir.z -= getKeyValue(inputState, 'down');
    }

    if (dir.x || dir.z) logic.moveTowards(dir);

    if (inputState.pointer && getActiveCamera()) {
      const projected = getProjectedPointerPosition(
        inputState,
        getActiveCamera().camera
      );
      if (projected) logic.turnTo(projected);
    }

    // fire bullet
    if (isKeyPressed(inputState, 'shoot')) {
      logic.fireBullet();
    }

    if (isKeyPressed(inputState, 'switch_polarity', true)) {
      logic.polarity = opposite(logic.polarity);
    }
  }
}
