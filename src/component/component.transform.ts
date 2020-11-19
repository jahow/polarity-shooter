import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { getScene } from '../app/engine';
import BaseComponent from './component.base';

export default class TransformComponent extends BaseComponent {
  private readonly node;

  constructor(position?: Vector3, rotation?: Vector3, scaling?: Vector3) {
    super();
    this.node = new TransformNode('transform node', getScene());
    if (position) this.setPosition(position);
    if (rotation) this.setRotation(rotation);
    if (scaling) this.setScaling(scaling);
  }

  setPosition(position: Vector3) {
    this.node.position = position;
  }

  setRotation(rotation: Vector3) {
    this.node.rotation = rotation;
  }

  setScaling(scaling: Vector3) {
    this.node.scaling = scaling;
  }

  getNode() {
    return this.node;
  }

  setParent(transform: TransformComponent) {
    this.node.parent = transform.getNode();
  }

  clearParent() {
    this.node.parent = null;
  }
}
