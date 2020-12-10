import BaseMeshComponent from './component.mesh.base';
import Mesh from '../../utils/mesh';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { getScene } from '../../app/engine';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Colors, Polarity } from '../../utils/polarity';

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

  setPolarity(polarity: Polarity) {
    this.actorMesh.renderOverlay = true;
    this.actorMesh.overlayColor = Colors[polarity];
    this.actorMesh.overlayAlpha = 0.7;
  }
}
