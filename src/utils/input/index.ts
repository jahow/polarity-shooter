import { TargetCamera } from '@babylonjs/core/Cameras/targetCamera';
import { getScene } from '../../app/engine';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import Mesh from '../mesh';
import { AnalogInput, AvailableKeys, GlobalInputState, KeyPressedState, KeyState } from './model';
import {
  getActiveControllerAxisValue,
  getActiveControllerButtonValue,
  getPointerStateFromAxis,
  hasActiveController
} from './controller';
import { getKeyboardKeyDown, getPointerDown, getPointerState, KeyCode } from './keyboard-and-mouse';

export function isPointerActive(state: GlobalInputState) {
  return !!state.pointer;
}

export function isKeyPressed(
  state: GlobalInputState,
  key: AvailableKeys,
  firstPressed?: boolean
) {
  const keyState = state.keys[key].state;
  return (
    (!firstPressed && keyState === 'pressed') || keyState === 'first_pressed'
  );
}

export function getKeyValue(
  state: GlobalInputState,
  key: AvailableKeys
): AnalogInput {
  return state.keys[key].value;
}

export function getGlobalState(prevState?: GlobalInputState): GlobalInputState {
  function getKeyPressedState(value, prevKeyState?: KeyState): KeyPressedState {
    if (!prevKeyState) return value > 0 ? 'pressed' : 'released';
    if (value > 0) {
      return prevKeyState.state === 'released' ? 'first_pressed' : 'pressed';
    } else return 'released';
  }

  function getKeyState(
    value: AnalogInput | boolean,
    prevKeyState?: KeyState
  ): KeyState {
    let analogValue: AnalogInput;
    if (typeof value === 'boolean') {
      analogValue = value ? 1 : 0;
    } else analogValue = value;
    return {
      value: analogValue,
      state: getKeyPressedState(value, prevKeyState)
    };
  }

  if (hasActiveController()) {
    return {
      keys: {
        up: getKeyState(
          getActiveControllerAxisValue(1, '-'),
          prevState && prevState.keys.up
        ),
        down: getKeyState(
          getActiveControllerAxisValue(1, '+'),
          prevState && prevState.keys.down
        ),
        left: getKeyState(
          getActiveControllerAxisValue(0, '-'),
          prevState && prevState.keys.left
        ),
        right: getKeyState(
          getActiveControllerAxisValue(0, '+'),
          prevState && prevState.keys.right
        ),
        shoot: getKeyState(
          getActiveControllerButtonValue(5),
          prevState && prevState.keys.shoot
        ),
        switch_polarity: getKeyState(
          getActiveControllerButtonValue(4),
          prevState && prevState.keys.switch_polarity
        ),
        resetGame: getKeyState(
          getActiveControllerButtonValue(9),
          prevState && prevState.keys.resetGame
        )
      },
      pointer: getPointerStateFromAxis(2, 3)
    };
  } else {
    return {
      keys: {
        up: getKeyState(
          getKeyboardKeyDown(KeyCode.ArrowUp),
          prevState && prevState.keys.up
        ),
        down: getKeyState(
          getKeyboardKeyDown(KeyCode.ArrowDown),
          prevState && prevState.keys.down
        ),
        left: getKeyState(
          getKeyboardKeyDown(KeyCode.ArrowLeft),
          prevState && prevState.keys.left
        ),
        right: getKeyState(
          getKeyboardKeyDown(KeyCode.ArrowRight),
          prevState && prevState.keys.right
        ),
        shoot: getKeyState(getPointerDown(), prevState && prevState.keys.shoot),
        switch_polarity: getKeyState(
          getKeyboardKeyDown(KeyCode.Space),
          prevState && prevState.keys.switch_polarity
        ),
        resetGame: { state: 'released', value: 0 } // no key yet
      },
      pointer: getPointerState()
    };
  }
}

export function getKeysStateChanged(
  newState: GlobalInputState,
  oldState: GlobalInputState
): boolean {
  return Object.keys(newState.keys).reduce(
    (prev, curr) =>
      prev ||
      newState.keys[curr].state !== oldState.keys[curr].state ||
      newState.keys[curr].value !== oldState.keys[curr].value,
    false
  );
}

export function getPointerStateChanged(
  newState: GlobalInputState,
  oldState: GlobalInputState
): boolean {
  if (!newState.pointer && !oldState.pointer) return false;
  if (!newState.pointer || !oldState.pointer) return true;
  return oldState.pointer.y !== newState.pointer.y || oldState.pointer.x !== newState.pointer.x || oldState.pointer.deltaX !== newState.pointer.deltaX || oldState.pointer.deltaY !== newState.pointer.deltaY;
}

let pickablePlane;

export function getProjectedPointerPosition(
  state: GlobalInputState,
  camera: TargetCamera,
  y: number = 0
): Vector3 {
  if (!isPointerActive(state)) {
    return null;
  }

  if (!pickablePlane) {
    pickablePlane = new Mesh('pickable plane', true)
      .pushQuad([-1000, 0, -1000], [2000, 0, 0], [0, 0, 2000])
      .commit();
    pickablePlane.isVisible = false;
  }

  pickablePlane.position.x = camera.target.x;
  pickablePlane.position.y = y;
  pickablePlane.position.z = camera.target.z;
  const info = getScene().pick(
    state.pointer.x,
    state.pointer.y,
    (mesh) => mesh === pickablePlane,
    true
  );
  if (!info || !info.hit) return null;
  return info.pickedPoint;
}
