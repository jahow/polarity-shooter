import BaseSystem from './system.base';
import Entity from '../entity/entity';
import { Bodies, Body, Engine, Render, World } from 'matter-js';
import PhysicsComponent from '../component/component.physics';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

export enum CollisionGroup {
  ENEMY = 0x00001,
  ENEMY_BULLET = 0x00010,
  PLAYER = 0x00100,
  PLAYER_BULLET = 0x01000,
  WALL = 0x10000,
}

function getCollisionMask(group: CollisionGroup) {
  switch (group) {
    case CollisionGroup.ENEMY:
      return 0x11100;
    case CollisionGroup.ENEMY_BULLET:
      return 0x10100;
    case CollisionGroup.PLAYER:
      return 0x10011;
    case CollisionGroup.PLAYER_BULLET:
      return 0x10001;
    case CollisionGroup.WALL:
      return 0x11111;
  }
}

export enum ImpostorType {
  BOX,
  CYLINDER,
}

export type ImpostorSize = number | [number, number];

// this will be used to render a view of the physics scene
const element = document.getElementById('physics-scene');

// matter-js globals
const engine = Engine.create();
const render = Render.create({
  element,
  engine: engine,
  bounds: {
    min: {
      x: -100,
      y: -100,
    },
    max: {
      x: 100,
      y: 100,
    },
  },
  options: {
    width: element.getBoundingClientRect().width,
    height: element.getBoundingClientRect().height,
    hasBounds: true,
    showVelocity: true,
    showAngleIndicator: true,
  },
});

engine.world.gravity = {
  x: 0,
  y: 0,
};

function vectorToPhysics(v: Vector3) {
  return { x: v.x * 10, y: v.z * -10 };
}

function sizeToPhysics(size: ImpostorSize) {
  const arr = Array.isArray(size) ? size : [size, size];
  return arr.map((n) => n * 10);
}

function vectorFromPhysics(c: { x: number; y: number }, v: Vector3) {
  v.x = c.x / 10;
  v.z = -c.y / 10;
}

// run the renderer
Render.run(render);

const entityBodies: { [id: number]: Object } = {};

function updateEntityBody(entity: Entity) {
  const comp = entity.getComponent<PhysicsComponent>(PhysicsComponent);
  const transform = entity.getTransform();
  const pos = vectorToPhysics(transform.getPosition());
  let body = entityBodies[entity.getId()];

  if (!body) {
    const size = sizeToPhysics(comp.size);
    switch (comp.type) {
      case ImpostorType.BOX:
        body = Bodies.rectangle(pos.x, pos.y, size[0], size[1]);
        break;
      case ImpostorType.CYLINDER:
        body = Bodies.circle(pos.x, pos.y, size[0]);
        break;
    }
    Body.setAngle(body, transform.getRotation().y);
    body.frictionAir = 0.3;
    body.collisionFilter.mask = getCollisionMask(comp.group);
    body.collisionFilter.category = comp.group;
    if (!comp.collides) body.isSensor = true;

    entityBodies[entity.getId()] = body;
    World.add(engine.world, body);
  }

  // Body.setPosition(body, { x: pos.x, y: -pos.z });
  Body.setVelocity(body, vectorToPhysics(comp.velocity));
  if (comp.isAngleForced()) {
    Body.setAngle(body, comp.angle);
  }

  // update mesh
  vectorFromPhysics(body.position, transform.getPosition());
  transform.getRotation().y = body.angle;
}

export default class PhysicsSystem extends BaseSystem {
  run(allEntities: Entity[]) {
    for (let entity of allEntities) {
      if (!entity.hasComponent(PhysicsComponent)) {
        continue;
      }
      updateEntityBody(entity);
    }

    Engine.update(engine);
  }
}
