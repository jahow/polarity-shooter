import BaseComponent from '../component.base';
import Entity from '../../entity/entity';

export default class BaseControllerComponent extends BaseComponent {
  preUpdate() {}
  update() {}
  postUpdate() {}

  collided(collider: Entity) {}
}
