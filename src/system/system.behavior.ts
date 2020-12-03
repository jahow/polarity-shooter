import BaseSystem from './system.base';
import Entity from '../entity/entity';
import BaseBehaviorComponent from '../component/behavior/component.behavior.base';

export default class BehaviorSystem extends BaseSystem {
  run(allEntities: Entity[]) {
    const entities = allEntities.filter((e) =>
      e.hasComponent(BaseBehaviorComponent)
    );

    for (let entity of entities) {
      const component = entity.getComponent<BaseBehaviorComponent>(
        BaseBehaviorComponent
      );
      component.updateTasks();
    }
  }
}
