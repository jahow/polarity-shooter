import BaseLogicComponent from './component.logic.base';
import PhysicsComponent from '../component.physics';
import Entity from '../../entity/entity';

export default class BulletLogicComponent extends BaseLogicComponent {
  private speed = 0.8;

  attach(entity: Entity) {
    super.attach(entity);

    const heading = this.transform.getNode().right;
    const physics = this.entity.getComponent<PhysicsComponent>(
      PhysicsComponent
    );
    physics.velocity = heading.scaleInPlace(this.speed);
  }

  preUpdate() {}
  update() {}
  postUpdate() {}
}
