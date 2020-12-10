import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Color4 } from '@babylonjs/core/Maths/math.color';
import '@babylonjs/core/Materials/standardMaterial';
import '@babylonjs/core/Meshes/meshBuilder';
import '@babylonjs/core/Rendering/outlineRenderer';

// uncomment for inspector
// import '@babylonjs/core/Debug/debugLayer';
// import '@babylonjs/inspector';

let engine: Engine;
let canvas: HTMLCanvasElement;
let scene: Scene;

export function init() {
  canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  document.body.appendChild(canvas);

  engine = new Engine(canvas, true, { stencil: true });
  engine.setDepthBuffer(true);

  scene = new Scene(engine);
  scene.clearColor = new Color4(0.4, 0.4, 0.4, 255);

  // uncomment for inspector
  // scene.debugLayer.show();
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
