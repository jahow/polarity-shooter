import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
import { Camera } from '@babylonjs/core/Cameras/camera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { getScene } from './engine';

let camera: UniversalCamera;

export function initView() {
  camera = new UniversalCamera('main', new Vector3(0, 20, -5), getScene());
  camera.setTarget(new Vector3(0, 0, 0));
}

export function getCamera(): Camera {
  return camera;
}

export function moveView(deltaX: number, deltaY: number, deltaZ: number) {
  camera.position.addInPlace(new Vector3(deltaX, deltaY, deltaZ));
}
