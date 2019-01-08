const TWO_PI = 2 * Math.PI;

let generate = false;
let z1 = 0;

export default function gaussianRandom(mean, stdDev) {
  generate = !generate;
  if (!generate) return z1 * stdDev + mean;

  const u1 = Math.random(),
        u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(TWO_PI * u2);
  z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(TWO_PI * u2);
  return z0 * stdDev + mean;
}
