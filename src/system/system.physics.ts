import BaseSystem from './system.base';
import Entity from '../entity/entity';
import { Bodies, Body, Engine, Render, World, Events, Bounds } from 'matter-js';
import PhysicsComponent from '../component/component.physics';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import BaseLogicComponent from '../component/logic/component.logic.base';
import PlayerInputComponent from '../component/input/component.input.player';

const RENDER_ENABLED = false;

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

const FRICTION_AIR = 0.3;
const BODY_DENSITY = 0.1;

// matter-js engine
const engine = Engine.create();
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

// configure & run renderer
const canvas = document.getElementById('physics-scene');
if (RENDER_ENABLED) {
  const render = Render.create({
    canvas,
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
      width: canvas.getBoundingClientRect().width,
      height: canvas.getBoundingClientRect().height,
      hasBounds: true,
      showVelocity: true,
      showAngleIndicator: true,
    },
  });
  Render.run(render);
} else {
  canvas.remove();
}

// register events
Events.on(engine, 'collisionStart', function (event) {
  const pairs = event.pairs;

  // change object colours to show those in an active collision (e.g. resting contact)
  for (var i = 0; i < pairs.length; i++) {
    const entityA = pairs[i].bodyA._entity;
    const entityB = pairs[i].bodyB._entity;

    const logicA = entityA.getComponent<BaseLogicComponent>(BaseLogicComponent);
    const logicB = entityB.getComponent<BaseLogicComponent>(BaseLogicComponent);
    if (logicA) logicA.collided(entityB);
    if (logicB) logicB.collided(entityA);
  }
});

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
        body = Bodies.circle(pos.x, pos.y, size[0] / 2);
        break;
    }
    Body.setAngle(body, transform.getRotation().y);
    body.frictionAir = FRICTION_AIR;
    body.density = BODY_DENSITY;
    body.collisionFilter.mask = getCollisionMask(comp.group);
    body.collisionFilter.category = comp.group;
    if (!comp.collides) body.isSensor = true;
    body._entity = entity;

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

  // center on entity if player
  if (entity.hasComponent(PlayerInputComponent) && RENDER_ENABLED) {
    Bounds.shift(render.bounds, {
      x: body.position.x - 100,
      y: body.position.y - 100,
    });
  }
}

function clearEntityBody(entityId: number) {
  let body = entityBodies[entityId];
  World.remove(engine.world, body, true);
}

export default class PhysicsSystem extends BaseSystem {
  run(allEntities: Entity[]) {
    const entities = allEntities.filter((e) =>
      e.hasComponent(PhysicsComponent)
    );
    for (let entity of entities) {
      updateEntityBody(entity);
    }

    // clear entities which don't exist anymore
    const entityIds = entities.map((e) => e.getId());
    Object.keys(entityBodies)
      .map((id) => parseInt(id))
      .filter((id) => entityIds.indexOf(id) === -1)
      .forEach((id) => clearEntityBody(id));

    Engine.update(engine);
  }
}
