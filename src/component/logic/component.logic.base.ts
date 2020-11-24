import BaseComponent from '../component.base';
import { GlobalInputState } from '../../utils/input';
import Entity from '../../entity/entity';

export default class BaseLogicComponent extends BaseComponent {
  preUpdate() {}
  update() {}
  postUpdate() {}

  collided(collider: Entity) {}
}
