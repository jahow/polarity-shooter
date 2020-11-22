import BaseSystem from './system.base';
import Entity from '../entity/entity';
import { Color3, DirectionalLight, Vector3 } from '@babylonjs/core';
import { initView } from '../app/view';
import BaseMeshComponent from '../component/component.mesh.base';
import { getScene } from '../app/engine';
import CameraComponent from '../component/component.camera';

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
    for (let entity of allEntities) {
      // update mesh
      if (entity.hasComponent(BaseMeshComponent)) {
        const component = entity.getComponent<BaseMeshComponent>(
          BaseMeshComponent
        );
        component.updateMesh();
      }

      // update camera
      if (entity.hasComponent(CameraComponent)) {
        const component = entity.getComponent<CameraComponent>(CameraComponent);
        component.updateCamera();
      }
    }

    getScene().render();
  }
}
