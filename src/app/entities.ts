import Entity from '../entity/entity';
import CameraComponent from '../component/component.camera';
import PlayerInputComponent from '../component/input/component.input.player';

const entities: Entity[] = [];

export function getEntities() {
  return entities;
}

export function addEntity(entity: Entity) {
  if (entities.indexOf(entity) > 1) {
    console.warn(`Entity ${entity.id} was already added`);
    return;
  }
  entities.push(entity);
}

export function removeEntity(entity: Entity) {
  const index = entities.indexOf(entity);

  // entity was already disposed: do nothing
  if (index === -1) {
    return;
  }

  entities.splice(index, 1);

  setTimeout(() => {
    entity.dispose();
  });
}

export function getActiveCameraComponent() {
  for (let i = 0; i < entities.length; i++) {
    if (entities[i].hasComponent(CameraComponent))
      return entities[i].getComponent<CameraComponent>(CameraComponent);
  }
}

export function getPlayerEntity() {
  for (let i = 0; i < entities.length; i++) {
    if (entities[i].hasComponent(PlayerInputComponent)) return entities[i];
  }
}
