import BaseMeshComponent from './component.mesh.base';
import Mesh from '../../utils/mesh';
import { Vector3, Vector4 } from '@babylonjs/core/Maths/math.vector';
import { Plane } from '@babylonjs/core/Maths/math.plane';
import { getScene } from '../../app/engine';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { getActiveCamera } from '../../system/system.render';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { MirrorTexture } from '@babylonjs/core';

const GROUND_SIZE = 80;
const GROUND_GRID_SIZE = 4;

export default class GroundMeshComponent extends BaseMeshComponent {
  initMesh() {
    const ground = MeshBuilder.CreatePlane('ground', {
      size: GROUND_SIZE,
      frontUVs: new Vector4(
        0,
        0,
        GROUND_SIZE / GROUND_GRID_SIZE,
        GROUND_SIZE / GROUND_GRID_SIZE
      ),
      updatable: false,
      sourcePlane: Plane.FromPositionAndNormal(Vector3.Zero(), Vector3.Up()),
      sideOrientation: Mesh.DOUBLESIDE
    });

    ground.position = new Vector3(0, -1, 0);

    // create reflector for ground
    const reflector = Plane.FromPositionAndNormal(
      ground.position,
      Vector3.Down()
    );

    const material = new StandardMaterial('ground mirror', getScene());
    const mirrorTexture = new MirrorTexture(
      'mirror',
      512,
      getScene(),
      true
    );
    mirrorTexture.mirrorPlane = reflector;
    mirrorTexture.level = 0.4;
    mirrorTexture.adaptiveBlurKernel = 20;
    Object.defineProperty(mirrorTexture, 'renderList', {
      get: () => getScene().meshes.filter((m) => m !== ground)
    });
    material.reflectionTexture = mirrorTexture;

    material.ambientTexture = new Texture(
      '/assets/ground_tile.png',
      getScene(),
      true,
      false,
      Texture.NEAREST_SAMPLINGMODE
    );
    material.ambientTexture.wrapU = Texture.WRAP_ADDRESSMODE;
    material.ambientTexture.wrapV = Texture.WRAP_ADDRESSMODE;
    material.specularColor = new Color3(0, 0, 0);

    ground.material = material;

    return ground;
  }

  updateMesh() {
    // align grid to camera
    const camera = getActiveCamera();
    if (!camera) return;

    const pos = camera.camera.target;
    this.mesh.position.x =
      Math.floor(pos.x / GROUND_GRID_SIZE) * GROUND_GRID_SIZE;
    this.mesh.position.z =
      Math.floor(pos.z / GROUND_GRID_SIZE) * GROUND_GRID_SIZE;
  }
}
