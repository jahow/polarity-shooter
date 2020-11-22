import BaseComponent from './component.base';
import { GlobalInputState } from '../utils/input';

export default class BaseInputComponent extends BaseComponent {
  receiveInput(inputState: GlobalInputState, prevState: GlobalInputState) {
    // do something
  }
}
