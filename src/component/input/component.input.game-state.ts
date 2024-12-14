import BaseInputComponent from './component.input.base';
import { isKeyPressed } from '../../utils/input';
import { GlobalInputState } from '../../utils/input/model';
import { reset } from '../../app/app';

export default class GameStateInputComponent extends BaseInputComponent {
  receiveInput(inputState: GlobalInputState, prevState: GlobalInputState) {
    // reset game
    if (isKeyPressed(inputState, 'resetGame', true)) {
      reset();
    }
  }
}
