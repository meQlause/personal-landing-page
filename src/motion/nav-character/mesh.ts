// Geometry and colour of the nav character's head: an icosphere, shaded from one fixed light.
export type Vec = number[];
export type Face = [number, number, number];

export interface Mesh {
  readonly vertices: Vec[];
  readonly faces: Face[];
}

interface Rgb {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
}

export const SPHERE = { radius: 27, widen: 1.04, flatten: 0.94 } as const;
const SHADE = { curve: 1.25 } as const;
const COLOUR: Record<'dark' | 'light' | 'rim', Rgb> = {
  dark: { red: 28, green: 33, blue: 132 },
  light: { red: 230, green: 233, blue: 255 },
  rim: { red: 255, green: 206, blue: 176 },
};
export const TINT = {
  dark: channels(COLOUR.dark),
  light: channels(COLOUR.light),
  rim: channels(COLOUR.rim),
} as const;
const LIGHT_FROM = { x: -0.45, y: -0.7, z: 0.55 } as const;
const GOLDEN = { seed: 5 } as const;
// The 20 faces of the icosahedron, as vertex indices. Kept as text so the table reads as one block.
const SEED_FACES =
  '0 11 5,0 5 1,0 1 7,0 7 10,0 10 11,1 5 9,5 11 4,11 10 2,10 7 6,7 1 8,3 9 4,3 4 2,3 2 6,3 6 8,3 8 9,4 9 5,2 4 11,6 2 10,8 6 7,9 8 1';

function channels(colour: Rgb): number[] {
  return [colour.red, colour.green, colour.blue];
}

export function norm(vector: readonly number[]): Vec {
  const length = Math.hypot(...vector) || 1;
  return vector.map((value) => value / length);
}

function dot(first: readonly number[], second: readonly number[]): number {
  return first.reduce((sum, value, index) => sum + value * second[index], 0);
}

export function mix(from: readonly number[], to: readonly number[], amount: number): number[] {
  return from.map((value, index) => Math.round(value + (to[index] - value) * amount));
}

const LIGHT = norm([LIGHT_FROM.x, LIGHT_FROM.y, LIGHT_FROM.z]);

// The colour of a face for its normal: lit from the light, with a small per-face jitter so the faces do not look flat.
export function shade(normal: Vec, jitter = 0): number[] {
  const lit = Math.max(0, dot(normal, LIGHT));
  return mix(TINT.dark, TINT.light, Math.min(1, lit ** SHADE.curve + jitter));
}

function midpoint(
  vertices: Vec[],
  cache: Map<string, number>,
  first: number,
  second: number,
): number {
  const key = first < second ? `${first}_${second}` : `${second}_${first}`;
  const known = cache.get(key);
  if (known !== undefined) {
    return known;
  }
  const index = vertices.length;
  vertices.push(norm(vertices[first].map((value, axis) => (value + vertices[second][axis]) / 2)));
  cache.set(key, index);
  return index;
}

// One subdivision of the regular icosahedron, stretched a touch wide and shallow: a round little face, not a ball.
export function icosphere(): Mesh {
  const phi = (1 + Math.sqrt(GOLDEN.seed)) / 2;
  const vertices: Vec[] = [
    [-1, phi, 0],
    [1, phi, 0],
    [-1, -phi, 0],
    [1, -phi, 0],
    [0, -1, phi],
    [0, 1, phi],
    [0, -1, -phi],
    [0, 1, -phi],
    [phi, 0, -1],
    [phi, 0, 1],
    [-phi, 0, -1],
    [-phi, 0, 1],
  ].map(norm);
  const seed = SEED_FACES.split(',').map((triple): Face => {
    const [first, second, third] = triple.split(' ').map(Number);
    return [first, second, third];
  });
  const cache = new Map<string, number>();
  const faces = seed.flatMap(([first, second, third]): Face[] => {
    const abMid = midpoint(vertices, cache, first, second);
    const bcMid = midpoint(vertices, cache, second, third);
    const caMid = midpoint(vertices, cache, third, first);
    return [
      [first, abMid, caMid],
      [second, bcMid, abMid],
      [third, caMid, bcMid],
      [abMid, bcMid, caMid],
    ];
  });
  return {
    vertices: vertices.map(([across, up, depth]) => [
      across * SPHERE.radius * SPHERE.widen,
      up * SPHERE.radius,
      depth * SPHERE.radius * SPHERE.flatten,
    ]),
    faces,
  };
}
