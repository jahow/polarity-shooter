import { Color3 } from '@babylonjs/core/Maths/math.color';

export enum Polarity {
  POSITIVE,
  NEGATIVE,
}

export const Colors = {
  [Polarity.NEGATIVE]: new Color3(1, 0.3, 0.5),
  [Polarity.POSITIVE]: new Color3(0.3, 0.8, 0.9),
};

export function opposite(polarity: Polarity) {
  return polarity === Polarity.POSITIVE ? Polarity.NEGATIVE : Polarity.POSITIVE;
}
