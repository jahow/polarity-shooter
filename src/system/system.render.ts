import BaseSystem from './system.base';
import Entity from '../entity/entity';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import BaseMeshComponent from '../component/mesh/component.mesh.base';
import { getScene } from '../app/engine';
import CameraComponent from '../component/component.camera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';

let activeCamera: CameraComponent;

export default class RenderSystem extends BaseSystem {
  constructor() {
    super();

    const light = new HemisphericLight('light', Vector3.Up(), getScene());
    light.diffuse = new Color3(0.8, 0.8, 0.8);
    light.specular = new Color3(0.1, 0.1, 0.1);

    light.groundColor = new Color3(0.2, 0.05, 0.05);
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
