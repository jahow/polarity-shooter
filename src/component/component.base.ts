import Entity from '../entity/entity';

export default class BaseComponent {
  private entity: Entity;

  constructor() {}

  attach(entity: Entity) {
    this.entity = entity;
  }

  getEntity() {
    return this.entity;
  }
}
