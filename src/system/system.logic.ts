import BaseSystem from './system.base';
import Entity from '../entity/entity';
import BaseControllerComponent from '../component/controller/component.controller.base';

export default class LogicSystem extends BaseSystem {
  run(allEntities: Entity[]) {
    const entities = allEntities.filter((e) =>
      e.hasComponent(BaseControllerComponent)
    );

    // pre update
    for (let entity of entities) {
      const component = entity.getComponent<BaseControllerComponent>(
        BaseControllerComponent
      );
      component.preUpdate();
    }

    // update
    for (let entity of entities) {
      const component = entity.getComponent<BaseControllerComponent>(
        BaseControllerComponent
      );
      component.update();
    }

    // post update
    for (let entity of entities) {
      const component = entity.getComponent<BaseControllerComponent>(
        BaseControllerComponent
      );
      component.postUpdate();
    }
  }
}
