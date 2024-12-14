export type AnalogInput = number; // value between 0 and 1

export type KeyPressedState =
  | 'released'
  | 'pressed'
  | 'first_pressed'
  | 'not_found';

export interface KeyState {
  value: AnalogInput;
  state: KeyPressedState;
}

export interface KeysState {
  up: KeyState;
  down: KeyState;
  left: KeyState;
  right: KeyState;
  shoot: KeyState;
  switch_polarity: KeyState;
  resetGame: KeyState;
}

export type AvailableKeys = keyof KeysState;

export interface PointerState {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
}

export interface GlobalInputState {
  keys: KeysState;
  pointer?: PointerState; // a pointer may not be active
}
