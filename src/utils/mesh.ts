import { Mesh as BJSMesh } from '@babylonjs/core/Meshes/mesh';
import { Scene } from '@babylonjs/core/scene';
import { getScene } from '../app/engine';
import { VertexBuffer } from '@babylonjs/core/Meshes/buffer';
import { Color, Coords } from './model';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

interface LineWidth {
  left: number;
  right: number;
}

const BUFFER_SIZE = 8000;

export default class Mesh extends BJSMesh {
  _tempArrays: {
    positions: Array<number>;
    colors: Array<number>;
    uvs: Array<number>;
    indices: Array<number>;
  };
  _currentIndices: {
    positions: number;
    colors: number;
    uvs: number;
    indices: number;
  };
  _baseIndex: number;

  constructor(name: string, scene?: Scene) {
    super(name, scene || getScene());
    this._tempArrays = {
      positions: new Array<number>(),
      colors: new Array<number>(),
      uvs: new Array<number>(),
      indices: new Array<number>(),
    };
    this.clearVertices();
  }

  clearVertices() {
    this._tempArrays.positions.length = 0;
    this._tempArrays.colors.length = 0;
    this._tempArrays.uvs.length = 0;
    this._tempArrays.indices.length = 0;
    this._currentIndices = {
      positions: 0,
      colors: 0,
      uvs: 0,
      indices: 0,
    };
    this._baseIndex = 0;
    return this;
  }

  private _setBaseIndex() {
    this._baseIndex = this._currentIndices.positions / 3;
  }
  private _pushPositions(...positions: Array<number>) {
    Array.prototype.push.apply(this._tempArrays.positions, positions);
    this._currentIndices.positions += positions.length;
  }
  private _pushColors(...colors: Array<number>) {
    Array.prototype.push.apply(this._tempArrays.colors, colors);
    this._currentIndices.colors += colors.length;
  }
  private _pushUVs(...uvs: Array<number>) {
    Array.prototype.push.apply(this._tempArrays.uvs, uvs);
    this._currentIndices.uvs += uvs.length;
  }
  private _pushIndices(...indices: Array<number>) {
    Array.prototype.push.apply(
      this._tempArrays.indices,
      indices.map((i) => i + +this._baseIndex)
    );
    this._currentIndices.indices += indices.length;
  }

  // applies all pending modifications to the mesh
  commit() {
    this.setVerticesData(VertexBuffer.PositionKind, this._tempArrays.positions);
    this.setVerticesData(VertexBuffer.ColorKind, this._tempArrays.colors);
    this.setVerticesData(VertexBuffer.UVKind, this._tempArrays.uvs);
    this.setIndices(this._tempArrays.indices);
    this.createNormals(false);
    return this;
  }

  pushQuad(
    startPos: Coords,
    vector1: Coords,
    vector2: Coords,
    color?: Color,
    minU?: number,
    maxU?: number,
    minV?: number,
    maxV?: number
  ) {
    const color_ = color || [1, 1, 1, 1];
    this._setBaseIndex();
    this._pushPositions(
      startPos[0],
      startPos[1],
      startPos[2],
      startPos[0] + vector1[0],
      startPos[1] + vector1[1],
      startPos[2] + vector1[2],
      startPos[0] + vector1[0] + vector2[0],
      startPos[1] + vector1[1] + vector2[1],
      startPos[2] + vector1[2] + vector2[2],
      startPos[0] + vector2[0],
      startPos[1] + vector2[1],
      startPos[2] + vector2[2]
    );
    this._pushColors(
      color_[0],
      color_[1],
      color_[2],
      color_[3],
      color_[0],
      color_[1],
      color_[2],
      color_[3],
      color_[0],
      color_[1],
      color_[2],
      color_[3],
      color_[0],
      color_[1],
      color_[2],
      color_[3]
    );
    this._pushUVs(
      minU || 0,
      minV || 0,
      maxU || 0,
      minV || 0,
      maxU || 0,
      maxV || 0,
      minU || 0,
      maxV || 0
    );

    this._pushIndices(0, 1, 2, 0, 2, 3);

    return this;
  }

  // TODO: UV along line
  pushLine(
    coords: Coords[],
    width: number | LineWidth,
    color?: Color,
    closed?: boolean
  ) {
    if (coords.length < 2) {
      throw new Error('Cannot render line with less than 2 coords');
    }

    let coords_ = coords;
    if (closed) {
      coords_ = coords.slice();
      coords_.push(coords[0], coords[1]);
      coords_.unshift(coords[coords.length - 1]);
    }

    const color_ = color || [1, 1, 1, 1];
    const wLeft =
      (<LineWidth>width).left !== undefined
        ? (<LineWidth>width).left
        : <number>width / 2;
    const wRight =
      (<LineWidth>width).right !== undefined
        ? (<LineWidth>width).right
        : <number>width / 2;

    // loop on vertices to create segments
    const offset = closed ? 1 : 0;
    for (let i = offset; i < coords_.length - offset; i++) {
      const current = coords_[i];
      let normal;

      // line start vertices
      if (i === 0) {
        const next = coords_[i + 1];
        normal = new Vector3(
          -next[2] + current[2],
          0,
          next[0] - current[0]
        ).normalize();
      } else {
        const previous = coords_[i - 1];
        normal = new Vector3(
          -current[2] + previous[2],
          0,
          current[0] - previous[0]
        ).normalize();

        // if not at line end: normal is average of both segments normals
        if (i < coords_.length - 1) {
          const next = coords_[i + 1];
          normal.addInPlace(
            new Vector3(
              -next[2] + current[2],
              0,
              next[0] - current[0]
            ).normalize()
          );
        }
      }

      this._setBaseIndex();
      this._pushPositions(
        current[0] + normal.x * wLeft,
        current[1],
        current[2] + normal.z * wLeft,
        current[0] - normal.x * wRight,
        current[1],
        current[2] - normal.z * wRight
      );
      this._pushColors(
        color_[0],
        color_[1],
        color_[2],
        color_[3],
        color_[0],
        color_[1],
        color_[2],
        color_[3]
      );
      this._pushUVs(0, 0);

      if (i > offset) {
        this._pushIndices(-1, 1, 0, -1, 0, -2);
      }
    }

    return this;
  }

  pushCube(center: Coords, size: [number, number, number], color?: Color) {
    // X+
    this.pushQuad(
      [
        center[0] + size[0] / 2,
        center[1] + size[1] / 2,
        center[2] - size[2] / 2,
      ],
      [0, -size[1], 0],
      [0, 0, size[2]],
      color
    );
    // Y+
    this.pushQuad(
      [
        center[0] - size[0] / 2,
        center[1] + size[1] / 2,
        center[2] - size[2] / 2,
      ],
      [size[0], 0, 0],
      [0, 0, size[2]],
      color
    );
    // Z+
    this.pushQuad(
      [
        center[0] - size[0] / 2,
        center[1] + size[1] / 2,
        center[2] + size[2] / 2,
      ],
      [size[0], 0, 0],
      [0, -size[1], 0],
      color
    );
    // X-
    this.pushQuad(
      [
        center[0] - size[0] / 2,
        center[1] + size[1] / 2,
        center[2] - size[2] / 2,
      ],
      [0, 0, size[2]],
      [0, -size[1], 0],
      color
    );
    // Y-
    this.pushQuad(
      [
        center[0] + size[0] / 2,
        center[1] - size[1] / 2,
        center[2] + size[2] / 2,
      ],
      [0, 0, -size[2]],
      [-size[0], 0, 0],
      color
    );
    // Z-
    this.pushQuad(
      [
        center[0] - size[0] / 2,
        center[1] - size[1] / 2,
        center[2] - size[2] / 2,
      ],
      [size[0], 0, 0],
      [0, size[1], 0],
      color
    );

    return this;
  }
}
