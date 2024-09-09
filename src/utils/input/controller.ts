import { AnalogInput } from './model';

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
  direction: '+' | '-'
): AnalogInput {
  const axis = getActiveController().axes[index];
  if (typeof axis !== 'number') return null;
  return direction === '+' ? Math.max(0, axis) : Math.max(0, -axis);
}
