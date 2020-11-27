import BaseMeshComponent from './component.mesh.base';
import Mesh from '../../utils/mesh';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { getScene } from '../../app/engine';

export default class ActorMeshComponent extends BaseMeshComponent {
  actorMesh: AbstractMesh;

  constructor(private meshFactory: () => Mesh) {
    super();
  }

  initMesh() {
    this.actorMesh = this.meshFactory();
    const root = new TransformNode('actor root', getScene());
    this.actorMesh.setParent(root);
    return root;
  }

  updateMesh() {
    // do stuff
  }

  getActorMesh() {
    return this.actorMesh;
  }
}
