const { decodeInBase } = require('./baseDecode');
const { BigRational } = require('./rational');

function extractPointsFromData(data) {
  const n = data.keys.n;
  const k = data.keys.k;

  const points = [];

  for (const key of Object.keys(data)) {
    if (key === 'keys') continue;

    const x = BigInt(key);
    const base = parseInt(data[key].base, 10);
    const valueStr = data[key].value;

    const y = decodeInBase(valueStr, base);
    points.push({ x, y });
  }

  points.sort((p1, p2) => {
    if (p1.x < p2.x) return -1;
    if (p1.x > p2.x) return 1;
    return 0;
  });

  const selectedPoints = points.slice(0, data.keys.k);

  if (selectedPoints.length < k) {
    throw new Error('Not enough points available');
  }

  return { points: selectedPoints, k };
}

function findSecretFromData(data) {
  const { points, k } = extractPointsFromData(data);

  let result = new BigRational(0n, 1n);

  for (let j = 0; j < k; j++) {
    const xj = points[j].x;
    const yj = points[j].y;

    let term = new BigRational(1n, 1n);

    for (let m = 0; m < k; m++) {
      if (m === j) continue;

      const xm = points[m].x;

      const num = -xm;
      const den = xj - xm;

      term = term.multiply(new BigRational(num, den));
    }

    term = term.multiplyBigInt(yj);

    result = result.add(term);
  }

  if (result.den !== 1n) {
    throw new Error(
      `Result is not an integer: ${result.num.toString()}/${result.den.toString()}`
    );
  }

  return result.num;
}

module.exports = { findSecretFromData };
