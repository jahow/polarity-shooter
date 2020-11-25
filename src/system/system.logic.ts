import BaseSystem from './system.base';
import Entity from '../entity/entity';
import BaseLogicComponent from '../component/logic/component.logic.base';

export default class LogicSystem extends BaseSystem {
  run(allEntities: Entity[]) {
    const entities = allEntities.filter((e) =>
      e.hasComponent(BaseLogicComponent)
    );

    // pre update
    for (let entity of entities) {
      const component = entity.getComponent<BaseLogicComponent>(
        BaseLogicComponent
      );
      component.preUpdate();
    }

    // update
    for (let entity of entities) {
      const component = entity.getComponent<BaseLogicComponent>(
        BaseLogicComponent
      );
      component.update();
    }

    // post update
    for (let entity of entities) {
      const component = entity.getComponent<BaseLogicComponent>(
        BaseLogicComponent
      );
      component.postUpdate();
    }
  }
}
