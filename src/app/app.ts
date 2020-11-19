import Entity from '../entity/entity';
import { init as initEngine, run } from './engine';
import RenderSystem from '../system/system.render';
import GroundMeshComponent from '../component/component.mesh.ground';
import ActorMeshComponent from '../component/component.mesh.actor';

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

addEntity(new Entity([new GroundMeshComponent()]));
addEntity(new Entity([new ActorMeshComponent()]));

export function start() {
  run(() => {
    renderSystem.run(entities);
  });
}
