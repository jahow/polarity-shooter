import Entity from '../entity/entity';
import BaseSystem from './system.base';
import { getGlobalState, getKeysStateChanged } from '../utils/input';
import BaseInputComponent from '../component/input/component.input.base';
import { GlobalInputState } from '../utils/input/model';

export default class InputSystem extends BaseSystem {
  prevState: GlobalInputState;
  inputState: GlobalInputState;

  constructor() {
    super();

    this.inputState = getGlobalState();
  }

  updateInputState() {
    const newState = getGlobalState(this.prevState);
    const changed = this.prevState
      ? getKeysStateChanged(newState, this.prevState)
      : true;

    if (changed) {
      this.inputState = newState;
    } else {
      this.inputState = this.prevState;
    }
  }

  run(allEntities: Entity[]) {
    for (let entity of allEntities) {
      if (!entity.hasComponent(BaseInputComponent)) continue;

      entity
        .getComponent<BaseInputComponent>(BaseInputComponent)
        .receiveInput(this.inputState, this.prevState);
    }

    this.updateInputState();

    this.prevState = this.inputState;
  }
}
