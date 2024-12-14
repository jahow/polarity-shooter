import BaseMeshComponent from './component.mesh.base';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { getScene } from '../../app/engine';
import { CreateGreasedLine, GreasedLineMesh } from '@babylonjs/core';

export default class HaloMeshComponent extends BaseMeshComponent {
  halo: GreasedLineMesh;

  constructor() {
    super();
  }

  initMesh() {
    const points = new Array(100).fill(0)
      .map((_, i) => i * Math.PI * 2 / 100)
      .map(angle => new Vector3(Math.cos(angle), 0, Math.sin(angle)))
    this.halo = CreateGreasedLine('halo', { points }, undefined, getScene()) as GreasedLineMesh;
    this.halo.scaling = Vector3.One().scale(2);
    return this.halo;
  }

  updateMesh() {
    // do stuff
  }
}
