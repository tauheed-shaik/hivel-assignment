# Hivel Assignment

This project reconstructs a hidden secret from a collection of encoded polynomial points. Each JSON test case provides a subset of points encoded in various bases; the code decodes the points, performs Lagrange interpolation at x = 0, and prints the resulting secret.

## Project Structure

- `index.js` – Entry point that loads `testcase1.json` and `testcase2.json`, invokes the reconstruction logic, and prints the recovered secrets.
- `interpolation.js` – Extracts points from the test data and runs Lagrange interpolation using arbitrary-precision rationals.
- `rational.js` – Minimal `BigRational` implementation built on top of `BigInt`.
- `baseDecode.js` – Converts base-*n* strings (up to base 36) into `BigInt` values.
- `testcase*.json` – Sample datasets containing encoded points.

## Requirements

- Node.js 18+ (BigInt support is required.)

## Setup

```bash
npm install
```

No third-party dependencies are required, but installing keeps the project metadata consistent.

## Usage

```bash
node index.js
```

The script prints two lines, one per test case:

1. Secret reconstructed from `testcase1.json`.
2. Secret reconstructed from `testcase2.json`.

## Test Cases & Expected Output

| Test case file   | Description                                                                                           | Expected secret |
|------------------|-------------------------------------------------------------------------------------------------------|-----------------|
| `testcase1.json` | Shamir setup with `n = 4`, `k = 3`. Points are provided in bases 2–10 and 4.                          | `3`             |
| `testcase2.json` | Larger instance with `n = 10`, `k = 7`, mixing bases 3–16.                                            | `79836264049851`|

Run `node index.js` and verify that the console output matches the two secrets above to ensure your changes are correct.

## How It Works

1. **Decode values** – `baseDecode.js` converts each point value from its specified base into a `BigInt`.
2. **Assemble points** – `interpolation.js` sorts the available points and selects the first `k` values required by the scheme.
3. **Lagrange interpolation** – Using `BigRational`, the algorithm evaluates the polynomial at `x = 0` to recover the constant term (the secret).
4. **Validation** – The final result must be an integer; otherwise the program raises an error to avoid returning a fractional secret.

## Testing

There are no automated tests yet. To validate changes manually, run `node index.js` and ensure the printed secrets remain unchanged.

## License

ISC
