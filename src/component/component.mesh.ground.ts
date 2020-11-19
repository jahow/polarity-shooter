import BaseMeshComponent from './component.mesh.base';
import Mesh from '../utils/mesh';

export default class GroundMeshComponent extends BaseMeshComponent {
  mesh: Mesh;

  constructor() {
    super();

    this.mesh = new Mesh('ground mesh')
      .pushQuad([-5, 0, -5], [10, 0, 0], [0, 0, 10], [0.6, 0.6, 0.6, 1])
      .commit();
  }

  updateMesh() {
    // do stuff
  }
}
