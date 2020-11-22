import BaseMeshComponent from './component.mesh.base';
import Mesh from '../../utils/mesh';

const GROUND_SIZE = 10;

export default class GroundMeshComponent extends BaseMeshComponent {
  initMesh() {
    return new Mesh('ground mesh')
      .pushQuad(
        [-GROUND_SIZE, -1, -GROUND_SIZE],
        [GROUND_SIZE * 2, 0, 0],
        [0, 0, GROUND_SIZE * 2],
        [0.6, 0.6, 0.6, 1]
      )
      .pushLine(
        [
          [-5, -0.99, -5],
          [5, -0.99, -5],
          [5, -0.99, 5],
          [-5, -0.99, 5],
        ],
        0.2,
        [0.2, 0.3, 0.7, 1],
        true
      )
      .pushLine(
        [
          [0, -0.99, -2],
          [0, -0.99, 2],
        ],
        0.2,
        [0.2, 0.3, 0.7, 1]
      )
      .pushLine(
        [
          [-2, -0.99, 0],
          [2, -0.99, 0],
        ],
        0.2,
        [0.2, 0.3, 0.7, 1]
      )
      .commit();
  }

  updateMesh() {
    // do stuff
  }
}
