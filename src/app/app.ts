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
import { Prefabs } from '../data/actor/prefabs';

initEngine();

const entities: Entity[] = [];
const renderSystem = new RenderSystem();
const inputSystem = new InputSystem();
const logicSystem = new LogicSystem();
const physicsSystem = new PhysicsSystem();

export function addEntity(entity: Entity) {
  if (entities.indexOf(entity) > 1) {
    console.warn(`Entity ${entity.getId()} was already added`);
    return;
  }
  entities.push(entity);
}

export function removeEntity(entity: Entity) {
  const index = entities.indexOf(entity);
  if (index === -1) {
    throw new Error('entity already disposed: ' + entity.getId());
  }
  entities.splice(index, 1);

  setTimeout(() => {
    entity.dispose();
  });
}

addEntity(new Entity([new TransformComponent(), new GroundMeshComponent()]));

const player = Prefabs.Player(Vector3.Zero());
addEntity(player);
addEntity(new Entity([new CameraComponent(new Vector3(0, 20, -10), player)]));

for (let i = 0; i < 6; i++) {
  addEntity(
    Prefabs.Enemy(
      new Vector3(Math.random() * 28 - 14, 0, Math.random() * 16 - 8),
      new Vector3(0, Math.random() * Math.PI * 2, 0)
    )
  );
}

export function start() {
  run(() => {
    inputSystem.run(entities);
    physicsSystem.run(entities);
    logicSystem.run(entities);
    renderSystem.run(entities);
  });
}
