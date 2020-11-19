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
  pushLine(properties: {
    coords: { x: number; z: number }[];
    width: number | LineWidth;
    color?: Color;
    closed?: boolean;
  }) {
    if (properties.coords.length < 2) {
      console.warn('Cannot render line with less than 2 coords');
      return;
    }

    let coords = properties.coords;
    if (properties.closed) {
      coords = properties.coords.slice();
      coords.push(properties.coords[0], properties.coords[1]);
      coords.unshift(properties.coords[properties.coords.length - 1]);
    }

    const color = properties.color || [1, 1, 1, 1];
    const wLeft =
      (<LineWidth>properties.width).left !== undefined
        ? (<LineWidth>properties.width).left
        : <number>properties.width / 2;
    const wRight =
      (<LineWidth>properties.width).right !== undefined
        ? (<LineWidth>properties.width).right
        : <number>properties.width / 2;

    // loop on vertices to create segments
    const offset = properties.closed ? 1 : 0;
    for (let i = offset; i < coords.length - offset; i++) {
      const current = coords[i];
      let normal;

      // line start vertices
      if (i === 0) {
        const next = coords[i + 1];
        normal = new Vector3(
          -next.z + current.z,
          0,
          next.x - current.x
        ).normalize();
        normal.set(-normal.z, 0, normal.x);
      } else {
        const previous = coords[i - 1];
        normal = new Vector3(
          -current.z + previous.z,
          0,
          current.x - previous.x
        ).normalize();
        normal.normalize();

        // if not at line end: normal is average of both segments normals
        if (i < coords.length - 1) {
          const next = coords[i + 1];
          normal.addInPlace(
            new Vector3(-next.z + current.z, 0, next.x - current.x).normalize()
          );
          5, 0, 5;
        }
      }

      this._setBaseIndex();
      this._pushPositions(
        current.x + normal.x * wLeft,
        0,
        current.z + normal.z * wLeft,
        current.x - normal.x * wRight,
        0,
        current.z - normal.z * wRight
      );
      this._pushColors(
        color[0],
        color[1],
        color[2],
        color[3],
        color[0],
        color[1],
        color[2],
        color[3]
      );
      this._pushUVs(0, 0);

      if (i > offset) {
        this._pushIndices(-1, 1, 0, -1, 0, -2);
      }
    }

    return this;
  }

  pushCube(center: Coords, size: [number, number, number], color?: Color) {
    // const color_ = color;
    // this._setBaseIndex();
    // this._pushPositions(
    //   center[0] - size[0],
    //   center[1] - size[1],
    //   center[2] - size[2],
    //   center[0] + size[0],
    //   center[1] - size[1],
    //   center[2] - size[2],
    //   center[0] + size[0],
    //   center[1] - size[1],
    //   center[2] + size[2],
    //   center[0] - size[0],
    //   center[1] - size[1],
    //   center[2] + size[2],
    //   center[0] - size[0],
    //   center[1] + size[1],
    //   center[2] - size[2],
    //   center[0] + size[0],
    //   center[1] + size[1],
    //   center[2] - size[2],
    //   center[0] + size[0],
    //   center[1] + size[1],
    //   center[2] + size[2],
    //   center[0] - size[0],
    //   center[1] + size[1],
    //   center[2] + size[2]
    // );
    // this._pushColors(
    //   color_[0],
    //   color_[1],
    //   color_[2],
    //   color_[3],
    //   color_[0],
    //   color_[1],
    //   color_[2],
    //   color_[3],
    //   color_[0],
    //   color_[1],
    //   color_[2],
    //   color_[3],
    //   color_[0],
    //   color_[1],
    //   color_[2],
    //   color_[3],
    //   color_[0],
    //   color_[1],
    //   color_[2],
    //   color_[3],
    //   color_[0],
    //   color_[1],
    //   color_[2],
    //   color_[3],
    //   color_[0],
    //   color_[1],
    //   color_[2],
    //   color_[3],
    //   color_[0],
    //   color_[1],
    //   color_[2],
    //   color_[3]
    // );
    //
    // this._pushIndices(0, 2, 1, 0, 3, 2);
    // this._pushIndices(0, 4, 7, 0, 7, 3);
    // this._pushIndices(0, 1, 5, 0, 5, 4);
    // this._pushIndices(1, 2, 6, 1, 6, 5);
    // this._pushIndices(2, 3, 7, 2, 7, 6);
    // this._pushIndices(4, 5, 6, 4, 6, 7);

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
      [-size[0], 0, 0],
      [0, 0, -size[2]],
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
