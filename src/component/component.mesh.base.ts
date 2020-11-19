import BaseComponent from './component.base';
import TransformComponent from './component.transform';

export default class BaseMeshComponent extends BaseComponent {
  constructor() {
    super();
  }

  updateMesh() {
    // do stuff
  }

  getTransform() {
    return this.getEntity().getComponent<TransformComponent>(
      TransformComponent
    );
  }
}
