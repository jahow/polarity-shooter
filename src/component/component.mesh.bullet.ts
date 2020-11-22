import BaseMeshComponent from './component.mesh.base';
import Mesh from '../utils/mesh';

export default class BulletMeshComponent extends BaseMeshComponent {
  initMesh() {
    return new Mesh('bullet')
      .pushCube([0, 0, 0], [0.2, 0.2, 0.2], [1, 1, 1, 1])
      .commit();
  }

  updateMesh() {
    // do stuff
  }
}
