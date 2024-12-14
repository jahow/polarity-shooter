import BaseMeshComponent from './component.mesh.base';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { getScene } from '../../app/engine';
import { CreateGreasedLine, GreasedLineMesh } from '@babylonjs/core';
import { Color3 } from '@babylonjs/core/Maths/math.color';

export default class HaloMeshComponent extends BaseMeshComponent {
  halo: GreasedLineMesh;

  constructor() {
    super();
  }

  initMesh() {
    const numVertices = 100;
    const points = new Array(numVertices).fill(0)
      .map((_, i) => i * Math.PI * 2 / (numVertices - 1))
      .map(angle => new Vector3(Math.cos(angle), 0, Math.sin(angle)));
    const widths = new Array(numVertices * 2).fill(3);
    const uvs = new Array(numVertices * 2).fill(0).map((_, i) => i % 2 === 0 ? i / numVertices : 1);
    this.halo = CreateGreasedLine('halo', { points, widths }, {
      useDash: true,
      dashCount: 10,
      dashRatio: 0.5,
      color: new Color3(1, 1, 0)
    }, getScene()) as GreasedLineMesh;
    this.halo.scaling = Vector3.One().scale(2);
    return this.halo;
  }

  updateMesh() {
    // do stuff
  }
}
