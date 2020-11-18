import BaseMeshComponent from './component.mesh.base';
import Mesh from '../utils/mesh';

export default class GroundMeshComponent extends BaseMeshComponent {
  mesh: Mesh;

  constructor() {
    super();

    this.mesh = new Mesh('ground mesh')
      .pushSimpleQuad({
        minX: -5,
        maxX: 5,
        minZ: -5,
        maxZ: 5,
      })
      .commit();
  }

  updateMesh() {
    // do stuff
  }
}
