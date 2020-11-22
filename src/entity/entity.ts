import BaseComponent from '../component/component.base';
import { getUid } from '../utils/uid';
import TransformComponent from '../component/component.transform';

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
    for (let i = 0; i < this.components.length; i++) {
      if (this.components[i] instanceof classConstructor) {
        return this.components.find((c) => c instanceof classConstructor) as T;
      }
    }
    return null;
  }

  getTransform() {
    return this.getComponent<TransformComponent>(TransformComponent);
  }
}
