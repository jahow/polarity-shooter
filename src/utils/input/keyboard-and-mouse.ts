import { PointerState } from './model';

export enum KeyCode {
  AltLeft = 'AltLeft',
  AltRight = 'AltRight',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  ArrowUp = 'ArrowUp',
  Backquote = 'Backquote',
  Backslash = 'Backslash',
  Backspace = 'Backspace',
  BracketLeft = 'BracketLeft',
  BracketRight = 'BracketRight',
  CapsLock = 'CapsLock',
  Comma = 'Comma',
  ContextMenu = 'ContextMenu',
  ControlLeft = 'ControlLeft',
  ControlRight = 'ControlRight',
  Delete = 'Delete',
  Digit0 = 'Digit0',
  Digit1 = 'Digit1',
  Digit2 = 'Digit2',
  Digit3 = 'Digit3',
  Digit4 = 'Digit4',
  Digit5 = 'Digit5',
  Digit6 = 'Digit6',
  Digit7 = 'Digit7',
  Digit8 = 'Digit8',
  Digit9 = 'Digit9',
  End = 'End',
  Enter = 'Enter',
  Equal = 'Equal',
  Escape = 'Escape',
  F1 = 'F1',
  F10 = 'F10',
  F11 = 'F11',
  F12 = 'F12',
  F2 = 'F2',
  F3 = 'F3',
  F4 = 'F4',
  F5 = 'F5',
  F6 = 'F6',
  F7 = 'F7',
  F8 = 'F8',
  F9 = 'F9',
  Home = 'Home',
  Insert = 'Insert',
  IntlBackslash = 'IntlBackslash',
  KeyA = 'KeyA',
  KeyB = 'KeyB',
  KeyC = 'KeyC',
  KeyD = 'KeyD',
  KeyE = 'KeyE',
  KeyF = 'KeyF',
  KeyG = 'KeyG',
  KeyH = 'KeyH',
  KeyI = 'KeyI',
  KeyJ = 'KeyJ',
  KeyK = 'KeyK',
  KeyL = 'KeyL',
  KeyM = 'KeyM',
  KeyN = 'KeyN',
  KeyO = 'KeyO',
  KeyP = 'KeyP',
  KeyQ = 'KeyQ',
  KeyR = 'KeyR',
  KeyS = 'KeyS',
  KeyT = 'KeyT',
  KeyU = 'KeyU',
  KeyV = 'KeyV',
  KeyW = 'KeyW',
  KeyX = 'KeyX',
  KeyY = 'KeyY',
  KeyZ = 'KeyZ',
  Minus = 'Minus',
  NumLock = 'NumLock',
  Numpad0 = 'Numpad0',
  Numpad1 = 'Numpad1',
  Numpad2 = 'Numpad2',
  Numpad3 = 'Numpad3',
  Numpad4 = 'Numpad4',
  Numpad5 = 'Numpad5',
  Numpad6 = 'Numpad6',
  Numpad7 = 'Numpad7',
  Numpad8 = 'Numpad8',
  Numpad9 = 'Numpad9',
  NumpadAdd = 'NumpadAdd',
  NumpadDecimal = 'NumpadDecimal',
  NumpadDivide = 'NumpadDivide',
  NumpadEnter = 'NumpadEnter',
  NumpadEqual = 'NumpadEqual',
  NumpadMultiply = 'NumpadMultiply',
  NumpadSubtract = 'NumpadSubtract',
  PageDown = 'PageDown',
  PageUp = 'PageUp',
  Pause = 'Pause',
  Period = 'Period',
  PrintScreen = 'PrintScreen',
  Quote = 'Quote',
  ScrollLock = 'ScrollLock',
  Semicolon = 'Semicolon',
  ShiftLeft = 'ShiftLeft',
  ShiftRight = 'ShiftRight',
  Slash = 'Slash',
  Space = 'Space',
  Tab = 'Tab',
}

const keyboardKeys: { [code: KeyCode]: true } = {};

window.addEventListener('keydown', (evt) => {
  keyboardKeys[evt.code] = true;
});
window.addEventListener('keyup', (evt) => {
  keyboardKeys[evt.code] = false;
});

export function getKeyboardKeyDown(key: KeyCode) {
  return !!keyboardKeys[key];
}

let pointerState: PointerState = null;
let pointerDown = false;

window.addEventListener('pointerdown', (evt) => {
  pointerDown = true;
});
window.addEventListener('pointerup', (evt) => {
  pointerDown = false;
});
window.addEventListener('pointermove', () => (event: PointerEvent) => {
  pointerState = {
    x: event.clientX,
    y: event.clientY,
    deltaX: event.movementX,
    deltaY: event.movementY,
  };
});

export function getPointerState() {
  return pointerState;
}

export function getPointerDown() {
  return pointerDown;
}
