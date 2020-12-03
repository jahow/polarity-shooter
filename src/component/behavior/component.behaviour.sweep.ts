import BaseBehaviorComponent from './component.behavior.base';
import { getPlayerEntity } from '../../app/entities';
import { RotateBehavior } from '../../behavior/movement';
import ActorControllerComponent from '../controller/component.controller.actor';
import Entity from '../../entity/entity';

// attacks the player in a sweeping movement, flying by regularly
export class SweepBehaviourComponent extends BaseBehaviorComponent {
  behavior = new RotateBehavior();
  controller: ActorControllerComponent;

  /**
   * @param {number} distanceFromPlayer How close the actor will pass to the player
   */
  constructor(private distanceFromPlayer: number) {
    super();
  }

  attach(entity: Entity) {
    super.attach(entity);
    this.controller = entity.getComponent<ActorControllerComponent>(
      ActorControllerComponent
    );
    this.behavior.center = this.transform.getPosition();
    this.behavior.radius = 9 + Math.random() * 3;
  }

  updateTasks() {
    const distance = this.distanceFromPlayer;
    const playerPos = getPlayerEntity().transform.getPosition();
    const diff = this.behavior.center
      .subtract(playerPos)
      .normalize()
      .scaleInPlace(distance + this.behavior.radius);
    this.behavior.center = playerPos.add(diff);

    this.behavior.apply(this.controller);
  }
}
