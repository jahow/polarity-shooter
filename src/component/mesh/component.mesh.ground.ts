import BaseMeshComponent from './component.mesh.base';
import Mesh from '../../utils/mesh';
import { getActiveCamera } from '../../system/system.render';

const GROUND_SIZE = 40;
const GROUND_GRID_SIZE = 4;
const GROUND_GRID_WIDTH = 0.2;
const GROUND_Y = -1;

export default class GroundMeshComponent extends BaseMeshComponent {
  initMesh() {
    const ground = new Mesh('ground').pushQuad(
      [-GROUND_SIZE / 2, -1, -GROUND_SIZE / 2],
      [GROUND_SIZE, 0, 0],
      [0, 0, GROUND_SIZE],
      [0.7, 0.7, 0.7, 1]
    );

    for (let i = 1; i < GROUND_SIZE / GROUND_GRID_SIZE; i++) {
      const shift = -GROUND_SIZE / 2 + i * GROUND_GRID_SIZE;
      ground
        .pushLine(
          [
            [shift, GROUND_Y + 0.001, -GROUND_SIZE / 2],
            [shift, GROUND_Y + 0.001, GROUND_SIZE / 2],
          ],
          GROUND_GRID_WIDTH,
          [0.2, 0.2, 0.7, 0.3]
        )
        .pushLine(
          [
            [-GROUND_SIZE / 2, GROUND_Y + 0.001, shift],
            [GROUND_SIZE / 2, GROUND_Y + 0.001, shift],
          ],
          GROUND_GRID_WIDTH,
          [0.2, 0.2, 0.7, 0.3]
        );
    }
    ground.hasVertexAlpha = true;
    // ground.material = new StandardMaterial('ground', getScene());

    return ground.commit();
  }

  updateMesh() {
    // align grid to camera
    const camera = getActiveCamera();
    if (!camera) return;

    const pos = camera.target.getTransform().getPosition();
    this.mesh.position.x =
      Math.floor(pos.x / GROUND_GRID_SIZE) * GROUND_GRID_SIZE;
    this.mesh.position.z =
      Math.floor(pos.z / GROUND_GRID_SIZE) * GROUND_GRID_SIZE;
  }
}
