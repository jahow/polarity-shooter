import Entity from '../entity/entity';
import TransformComponent from './component.transform';

export default class BaseComponent {
  private entity_: Entity;
  private transform_: TransformComponent;

  constructor() {}

  attach(entity: Entity) {
    this.entity_ = entity;
    this.transform_ = entity.getTransform();
  }

  get entity() {
    return this.entity_;
  }

  get transform() {
    return this.transform_;
  }
}
