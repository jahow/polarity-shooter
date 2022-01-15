import BaseComponent from '../component/component.base';
import { getUid } from '../utils/uid';
import TransformComponent from '../component/component.transform';

export default class Entity {
  id_ = getUid();
  disposed_ = false;

  constructor(private components: BaseComponent[]) {
    this.components.forEach((comp) => {
      comp.attach(this);
    });
  }

  get id() {
    return this.id_;
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

  get transform() {
    return this.getComponent<TransformComponent>(TransformComponent);
  }

  dispose() {
    this.disposed_ = true;
    this.components.forEach((comp) => {
      comp.dispose();
    });
  }

  get disposed() {
    return this.disposed_;
  }
}
