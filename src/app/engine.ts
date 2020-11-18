import { Engine, Scene, Color4 } from '@babylonjs/core';

let engine: Engine;
let canvas: HTMLCanvasElement;
let scene: Scene;

export function init() {
  canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  document.body.appendChild(canvas);

  engine = new Engine(canvas, true);
  engine.setDepthBuffer(true);

  scene = new Scene(engine);
  scene.clearColor = new Color4(0.4, 0.4, 0.4, 255);
}

export function run(loopCallback) {
  engine.runRenderLoop(loopCallback);
}

export function getScene(): Scene {
  return scene;
}

export function getCanvas(): HTMLCanvasElement {
  return canvas;
}
