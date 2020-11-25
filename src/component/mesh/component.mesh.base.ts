import BaseComponent from '../component.base';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { getScene } from '../../app/engine';
import Entity from '../../entity/entity';

export default class BaseMeshComponent extends BaseComponent {
  mesh: TransformNode;

  initMesh(): TransformNode {
    return new TransformNode('base mesh', getScene());
  }

  attach(entity: Entity) {
    super.attach(entity);
    this.mesh = this.initMesh();
    this.mesh.parent = this.transform.getNode();
  }

  updateMesh() {
    // do stuff
  }

  dispose() {
    super.dispose();
    this.mesh.dispose();
  }
}
