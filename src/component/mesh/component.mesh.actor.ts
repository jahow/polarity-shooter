import BaseMeshComponent from './component.mesh.base';
import Mesh from '../../utils/mesh';

export default class ActorMeshComponent extends BaseMeshComponent {
  initMesh() {
    return new Mesh('actor')
      .pushCube([0, 0, 0], [1, 1, 1], [0.9, 0.3, 0.3, 1])
      .pushCube([0, 0, 0.6], [0.6, 0.6, 0.6], [0.7, 0.2, 0.2, 1])
      .commit();
  }

  updateMesh() {
    // do stuff
  }
}