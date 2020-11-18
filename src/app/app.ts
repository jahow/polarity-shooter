import Entity from '../entity/entity';
import { init as initEngine, run } from './engine';
import RenderSystem from '../system/system.render';
import GroundMeshComponent from '../component/component.mesh.ground';

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

export function start() {
  run(() => {
    renderSystem.run(entities);
  });
}
