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
import { addEntity, getEntities } from './entities';

initEngine();

const renderSystem = new RenderSystem();
const inputSystem = new InputSystem();
const logicSystem = new LogicSystem();
const physicsSystem = new PhysicsSystem();
const behaviorSystem = new BehaviorSystem();

addEntity(new Entity([new TransformComponent(), new GroundMeshComponent()]));

const player = Prefabs.Player(Vector3.Zero());
addEntity(player);
addEntity(new Entity([new CameraComponent(new Vector3(0, 20, -10), player)]));

for (let i = 0; i < 10; i++) {
  addEntity(
    Prefabs.Enemy(
      new Vector3(Math.random() * 80 - 40, 0, Math.random() * 80 - 40),
      new Vector3(0, Math.random() * Math.PI * 2, 0)
    )
  );
}

export function start() {
  run(() => {
    const entities = getEntities();
    behaviorSystem.run(entities);
    inputSystem.run(entities);
    physicsSystem.run(entities);
    logicSystem.run(entities);
    renderSystem.run(entities);
  });
}
