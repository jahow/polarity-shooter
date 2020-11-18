import BaseComponent from '../component/component.base';
import { getUid } from '../utils/uid';

export default class Entity {
  id = getUid();

  constructor(private components: BaseComponent[]) {
    this.components.forEach((comp) => {
      comp.attach(this);
    });
  }

  getId() {
    return this.id;
  }

  hasComponent(classConstructor: Function) {
    return !!this.getComponent(classConstructor);
  }

  getComponent<T extends BaseComponent>(classConstructor: Function): T {
    return this.components.find((c) => c instanceof classConstructor) as T;
  }
}
