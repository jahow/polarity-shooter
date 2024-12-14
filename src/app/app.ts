import Entity from '../entity/entity';
import { init as initEngine, run } from './engine';
import RenderSystem from '../system/system.render';
import GroundMeshComponent from '../component/mesh/component.mesh.ground';
import TransformComponent from '../component/component.transform';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import InputSystem from '../system/system.input';
import CameraComponent from '../component/component.camera';
import LogicSystem from '../system/system.logic';
import PhysicsSystem from '../system/system.physics';
import { Prefabs } from '../data/prefabs';
import BehaviorSystem from '../system/system.behavior';
import { addEntity, clearAllEntities, getEntities } from './entities';
import GameStateInputComponent from '../component/input/component.input.game-state';

initEngine();

const renderSystem = new RenderSystem();
const inputSystem = new InputSystem();
const logicSystem = new LogicSystem();
const physicsSystem = new PhysicsSystem();
const behaviorSystem = new BehaviorSystem();

function initEntities() {
  addEntity(new Entity([
    new GameStateInputComponent()
  ]));
  addEntity(new Entity([new TransformComponent(), new GroundMeshComponent()]));

  const player = Prefabs.Player(Vector3.Zero());
  addEntity(player);
  const camera = new Entity([new CameraComponent(new Vector3(0, 80, -30))]);
  addEntity(camera);
  camera.getComponent<CameraComponent>(CameraComponent).target = player;

  for (let i = 0; i < 50; i++) {
    addEntity(
      Prefabs.Enemy(
        new Vector3(Math.random() * 80 - 40, 0, Math.random() * 80 - 40),
        new Vector3(0, Math.random() * Math.PI * 2, 0)
      )
    );
  }
}

export function start() {
  initEntities();

  run(() => {
    const entities = getEntities();
    behaviorSystem.run(entities);
    inputSystem.run(entities);
    physicsSystem.run(entities);
    logicSystem.run(entities);
    renderSystem.run(entities);
  });
}

export function reset() {
  clearAllEntities();
  initEntities();
}
