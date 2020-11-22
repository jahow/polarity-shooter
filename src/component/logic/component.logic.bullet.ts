import BaseLogicComponent from './component.logic.base';

export default class BulletLogicComponent extends BaseLogicComponent {
  private speed = 0.3;

  preUpdate() {}
  update() {
    const heading = this.transform.getNode().forward;
    this.transform.getPosition().addInPlace(heading.scaleInPlace(this.speed));
  }
  postUpdate() {}
}
