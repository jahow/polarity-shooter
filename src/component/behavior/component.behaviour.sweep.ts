import BaseBehaviorComponent from './component.behavior.base';
import { getPlayerEntity } from '../../app/entities';
import { RotateBehavior } from '../../behavior/movement';
import ActorControllerComponent from '../controller/component.controller.actor';
import Entity from '../../entity/entity';
import { DirectionalFireBehavior } from '../../behavior/fire';

// attacks the player in a sweeping movement, flying by regularly
export class SweepBehaviourComponent extends BaseBehaviorComponent {
  movementBehavior = new RotateBehavior();
  fireBehavior = new DirectionalFireBehavior();
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
    this.movementBehavior.center = this.transform.getPosition();
    this.movementBehavior.radius = 9 + Math.random() * 3;
  }

  updateTasks() {
    const minDistance = this.distanceFromPlayer;
    const playerPos = getPlayerEntity().transform.getPosition();
    const diff = this.movementBehavior.center
      .subtract(playerPos)
      .normalize()
      .scaleInPlace(minDistance + this.movementBehavior.radius);
    this.movementBehavior.center = playerPos.add(diff);

    this.fireBehavior.direction = diff.scaleInPlace(-1);
    this.fireBehavior.firing =
      this.transform.getPosition().subtract(playerPos).length() <
      minDistance * 1.4;

    this.movementBehavior.apply(this.controller);
    this.fireBehavior.apply(this.controller);
  }
}
