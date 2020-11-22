import BaseSystem from './system.base';
import Entity from '../entity/entity';
import BaseLogicComponent from '../component/logic/component.logic.base';

export default class LogicSystem extends BaseSystem {
  run(allEntities: Entity[]) {
    // pre update
    for (let entity of allEntities) {
      if (entity.hasComponent(BaseLogicComponent)) {
        const component = entity.getComponent<BaseLogicComponent>(
          BaseLogicComponent
        );
        component.preUpdate();
      }
    }

    // update
    for (let entity of allEntities) {
      if (entity.hasComponent(BaseLogicComponent)) {
        const component = entity.getComponent<BaseLogicComponent>(
          BaseLogicComponent
        );
        component.update();
      }
    }

    // post update
    for (let entity of allEntities) {
      if (entity.hasComponent(BaseLogicComponent)) {
        const component = entity.getComponent<BaseLogicComponent>(
          BaseLogicComponent
        );
        component.postUpdate();
      }
    }
  }
}
