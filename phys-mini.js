// phys-mini — minimal 2D physics for canvas games.
// Circles, gravity, bouncing, friction, walls. ~80 lines, no dependencies.

export function body(x, y, r, opts = {}) {
  return {
    x, y, r,
    vx: opts.vx ?? 0,
    vy: opts.vy ?? 0,
    mass: opts.mass ?? r * r, // area-ish by default
    restitution: opts.restitution ?? 0.7, // bounciness 0–1
    friction: opts.friction ?? 0.995, // per-second velocity decay
    static: opts.static ?? false,
  }
}

export function createWorld(opts = {}) {
  const bodies = []
  const g = opts.gravity ?? 900 // px/s²
  const bounds = opts.bounds ?? null // { x, y, w, h } keeps bodies inside

  function collide(a, b) {
    const dx = b.x - a.x
    const dy = b.y - a.y
    const dist = Math.hypot(dx, dy) || 0.0001
    const overlap = a.r + b.r - dist
    if (overlap <= 0) return
    const nx = dx / dist
    const ny = dy / dist
    // separate along the normal, weighted by inverse mass
    const invA = a.static ? 0 : 1 / a.mass
    const invB = b.static ? 0 : 1 / b.mass
    const total = invA + invB
    a.x -= nx * overlap * (invA / total)
    a.y -= ny * overlap * (invA / total)
    b.x += nx * overlap * (invB / total)
    b.y += ny * overlap * (invB / total)
    // impulse on the relative velocity
    const rvx = b.vx - a.vx
    const rvy = b.vy - a.vy
    const vel = rvx * nx + rvy * ny
    if (vel > 0) return // moving apart already
    const e = Math.min(a.restitution, b.restitution)
    const j = (-(1 + e) * vel) / total
    a.vx -= j * nx * invA
    a.vy -= j * ny * invA
    b.vx += j * nx * invB
    b.vy += j * ny * invB
  }

  function contain(b) {
    if (!bounds || b.static) return
    const { x, y, w, h } = bounds
    if (b.x - b.r < x) { b.x = x + b.r; b.vx = Math.abs(b.vx) * b.restitution }
    if (b.x + b.r > x + w) { b.x = x + w - b.r; b.vx = -Math.abs(b.vx) * b.restitution }
    if (b.y - b.r < y) { b.y = y + b.r; b.vy = Math.abs(b.vy) * b.restitution }
    if (b.y + b.r > y + h) { b.y = y + h - b.r; b.vy = -Math.abs(b.vy) * b.restitution }
  }

  return {
    bodies,
    gravity: g,
    add: (b) => (bodies.push(b), b),
    remove: (b) => bodies.splice(bodies.indexOf(b), 1),
    step(dt) {
      for (const b of bodies) {
        if (b.static) continue
        b.vy += g * dt
        const f = Math.pow(b.friction, dt)
        b.vx *= f
        b.vy *= f
        b.x += b.vx * dt
        b.y += b.vy * dt
      }
      // a couple of relaxation passes keeps stacked circles stable
      for (let k = 0; k < 2; k++) {
        for (let i = 0; i < bodies.length; i++) {
          contain(bodies[i])
          for (let j = i + 1; j < bodies.length; j++) collide(bodies[i], bodies[j])
        }
      }
    },
  }
}
