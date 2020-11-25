import BaseMeshComponent from './component.mesh.base';
import Mesh from '../../utils/mesh';

export default class ActorMeshComponent extends BaseMeshComponent {
  constructor(private meshFactory: () => Mesh) {
    super();
  }

  initMesh() {
    return this.meshFactory();
  }

  updateMesh() {
    // do stuff
  }
}
