import Entity from '../entity/entity';
import { init as initEngine, run } from './engine';
import RenderSystem from '../system/system.render';
import GroundMeshComponent from '../component/mesh/component.mesh.ground';
import ActorMeshComponent from '../component/mesh/component.mesh.actor';
import TransformComponent from '../component/component.transform';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import InputSystem from '../system/system.input';
import PlayerInputComponent from '../component/input/component.input.player';
import CameraComponent from '../component/component.camera';
import LogicSystem from '../system/system.logic';

initEngine();

const entities: Entity[] = [];
const renderSystem = new RenderSystem();
const inputSystem = new InputSystem();
const logicSystem = new LogicSystem();

export function addEntity(entity: Entity) {
  if (entities.indexOf(entity) > 1) {
    console.warn(`Entity ${entity.getId()} was already added`);
    return;
  }
  entities.push(entity);
}

addEntity(new Entity([new TransformComponent(), new GroundMeshComponent()]));

const player = new Entity([
  new TransformComponent(new Vector3(-2, 0, 1), new Vector3(0, Math.PI / 4, 0)),
  new ActorMeshComponent(),
  new PlayerInputComponent(),
]);
addEntity(player);
addEntity(new Entity([new CameraComponent(new Vector3(0, 20, -10), player)]));

for (let i = 0; i < 4; i++) {
  addEntity(
    new Entity([
      new TransformComponent(
        new Vector3(Math.random() * 16 - 8, 0, Math.random() * 16 - 8),
        new Vector3(0, Math.random() * Math.PI * 2, 0)
      ),
      new ActorMeshComponent(),
    ])
  );
}

export function start() {
  run(() => {
    inputSystem.run(entities);
    logicSystem.run(entities);
    renderSystem.run(entities);
  });
}
