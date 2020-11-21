import Entity from '../entity/entity';
import { init as initEngine, run } from './engine';
import RenderSystem from '../system/system.render';
import GroundMeshComponent from '../component/component.mesh.ground';
import ActorMeshComponent from '../component/component.mesh.actor';
import TransformComponent from '../component/component.transform';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

initEngine();

const entities: Entity[] = [];
const renderSystem = new RenderSystem();

function addEntity(entity: Entity) {
  if (entities.indexOf(entity) > 1) {
    console.warn(`Entity ${entity.getId()} was already added`);
    return;
  }
  entities.push(entity);
}

addEntity(new Entity([new TransformComponent(), new GroundMeshComponent()]));
addEntity(
  new Entity([
    new TransformComponent(
      new Vector3(-2, 0, 1),
      new Vector3(0, Math.PI / 4, 0)
    ),
    new ActorMeshComponent(),
  ])
);

export function start() {
  run(() => {
    renderSystem.run(entities);
  });
}
