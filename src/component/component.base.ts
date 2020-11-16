import Entity from '../entity/entity'

export default class BaseComponent {
  entity: Entity

  constructor() {}

  attach(entity: Entity) {
    this.entity = entity
  }
}
