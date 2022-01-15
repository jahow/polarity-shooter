import { AnalogInput } from './model';

const controllers = {};
let activeController: Gamepad = null;

function connectHandler(e) {
  controllers[e.gamepad.index] = e.gamepad;
  if (!activeController) {
    activeController = e.gamepad;
  }
}

function disconnectHandler(e) {
  if (e.gamepad === activeController) {
    activeController = null;
  }
  delete controllers[e.gamepad.index];
}

window.addEventListener('gamepadconnected', connectHandler);
window.addEventListener('gamepaddisconnected', disconnectHandler);

export function hasActiveController() {
  return !!activeController;
}

export function getActiveController() {
  return activeController;
}

export function getActiveControllerButtonValue(index: number): AnalogInput {
  const button = activeController.buttons[index];
  if (typeof button !== 'object') return null;
  return button.value;
}

export function getActiveControllerAxisValue(
  index: number,
  direction: '+' | '-'
): AnalogInput {
  const axis = activeController.axes[index];
  if (typeof axis !== 'number') return null;
  return direction === '+' ? Math.max(0, axis) : Math.max(0, -axis);
}
