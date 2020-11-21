import BaseComponent from './component.base';
import TransformComponent from './component.transform';
import { AbstractMesh, TransformNode } from '@babylonjs/core';
import { getScene } from '../app/engine';
import Entity from '../entity/entity';

export default class BaseMeshComponent extends BaseComponent {
  mesh: TransformNode;

  constructor() {
    super();

    this.mesh = this.initMesh();
  }

  initMesh(): TransformNode {
    return new TransformNode('base mesh', getScene());
  }

  attach(entity: Entity) {
    super.attach(entity);
    this.mesh.parent = this.getTransform().getNode();
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
