import { AnalogInput } from './model';
import { getCanvas } from '../../app/engine';

const controllers: Set<number> = new Set();
let activeControllerIndex: number = null;

function connectHandler(e) {
  controllers.add(e.gamepad.index);
  if (activeControllerIndex === null) {
    activeControllerIndex = e.gamepad.index;
  }
}

function disconnectHandler(e) {
  if (e.gamepad.index === activeControllerIndex) {
    activeControllerIndex = null;
  }
  controllers.delete(e.gamepad.index);
}

window.addEventListener('gamepadconnected', connectHandler);
window.addEventListener('gamepaddisconnected', disconnectHandler);

export function hasActiveController() {
  return activeControllerIndex !== null;
}

export function getActiveController() {
  if (!hasActiveController()) return null;
  return navigator.getGamepads()[activeControllerIndex];
}

export function getActiveControllerButtonValue(index: number): AnalogInput {
  const button = getActiveController().buttons[index];
  if (typeof button !== 'object') return null;
  return button.value;
}

export function getActiveControllerAxisValue(
  index: number,
  direction?: '+' | '-'
): AnalogInput {
  const axis = getActiveController().axes[index];
  if (typeof axis !== 'number') return null;
  if (direction === undefined) return axis;
  return direction === '+' ? Math.max(0, axis) : Math.max(0, -axis);
}

export function getPointerStateFromAxis(axisX: number, axisY: number) {
  if (!hasActiveController()) return null;
  const x = getActiveControllerAxisValue(axisX);
  const y = getActiveControllerAxisValue(axisY);
  const canvas = getCanvas()
  const radius = 100 // we're doing a circle over the center
  if (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) { return null }
  return {
    x: canvas.width / 2 + x * radius,
    y: canvas.height / 2 + y * radius,
    deltaX: 0,
    deltaY: 0,
  };
}
