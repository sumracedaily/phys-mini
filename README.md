# phys-mini

Minimal 2D physics for canvas games — circles, gravity, impulse collisions, wall bounds, friction. ~80 lines, zero dependencies, ESM + TypeScript types.

The honest scope: enough to make balls bounce, stack and settle. Not a Box2D — no rotation, no polygons, no joints. When a game needs "things that fall and collide," this is that thing.

## Use

```js
import { createWorld, body } from "./phys-mini.js"

const world = createWorld({
  gravity: 1200,                        // px/s²
  bounds: { x: 0, y: 0, w: 800, h: 600 },
})

const ball = world.add(body(100, 50, 16, {
  vx: 300,
  restitution: 0.8,                     // 0 = thud, 1 = superball
  friction: 0.995,                      // per-second decay
}))

const loop = (t) => {
  world.step(Math.min(dt, 0.05))        // clamp dt — tunneling is on you
  // draw world.bodies
}
```

Bodies expose `x, y, vx, vy` — read them to draw, write them to impart forces. `static: true` makes immovable floors and walls that still collide.

Open `demo/index.html` — click to drop balls, watch them collide and settle.

## License

MIT
