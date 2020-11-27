import BaseSystem from './system.base';
import Entity from '../entity/entity';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import BaseMeshComponent from '../component/mesh/component.mesh.base';
import { getScene } from '../app/engine';
import CameraComponent from '../component/component.camera';

let activeCamera: CameraComponent;

export default class RenderSystem extends BaseSystem {
  constructor() {
    super();

    let light = new DirectionalLight(
      'light',
      new Vector3(-0.2, -1, -0.4),
      getScene()
    );
    light.specular = Color3.Black();
    let light2 = new DirectionalLight(
      'light2',
      new Vector3(0.2, 0.1, 0.4),
      getScene()
    );
    light2.diffuse = new Color3(0.8, 0.6, 0.4);
  }

  run(allEntities: Entity[]) {
    activeCamera = null;

    // update camera
    for (let entity of allEntities) {
      if (entity.hasComponent(CameraComponent)) {
        const component = entity.getComponent<CameraComponent>(CameraComponent);
        activeCamera = component;
        component.updateCamera();
      }
    }

    // update mesh
    for (let entity of allEntities) {
      if (entity.hasComponent(BaseMeshComponent)) {
        const component = entity.getComponent<BaseMeshComponent>(
          BaseMeshComponent
        );
        component.updateMesh();
      }
    }

    getScene().render();
  }
}

export function getActiveCamera() {
  return activeCamera;
}
