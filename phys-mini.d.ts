export interface Body {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  mass: number
  /** bounciness 0–1 */
  restitution: number
  /** per-second velocity decay (0.995 ≈ ice, 0.9 ≈ grass) */
  friction: number
  static: boolean
}

export interface BodyOpts {
  vx?: number
  vy?: number
  mass?: number
  restitution?: number
  friction?: number
  static?: boolean
}

export interface Bounds {
  x: number
  y: number
  w: number
  h: number
}

export interface WorldOpts {
  /** px/s², default 900 */
  gravity?: number
  /** optional rect that keeps bodies inside */
  bounds?: Bounds
}

export interface World {
  bodies: Body[]
  gravity: number
  add(b: Body): Body
  remove(b: Body): void
  /** advance the simulation; call with a clamped dt (e.g. ≤0.05) */
  step(dt: number): void
}

export function body(x: number, y: number, r: number, opts?: BodyOpts): Body
export function createWorld(opts?: WorldOpts): World
