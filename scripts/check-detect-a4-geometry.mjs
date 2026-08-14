import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const source = fs.readFileSync(path.join(root, "src", "cv", "detectA4.js"), "utf8");
const loadGeometry = new Function(`${source}\nreturn { orderCorners, quadrilateralAspectRatio };`);
const { orderCorners, quadrilateralAspectRatio } = loadGeometry();

const A4_RATIO = 297 / 210;
const near = (actual, expected, tolerance, label) => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected.toFixed(4)}, got ${actual.toFixed(4)}`,
  );
};

const portrait = [
  { x: 0, y: 0 },
  { x: 210, y: 0 },
  { x: 210, y: 297 },
  { x: 0, y: 297 },
];
near(quadrilateralAspectRatio(orderCorners(structuredClone(portrait))), A4_RATIO, 1e-9, "portrait A4 ratio");

const landscapeUnordered = [
  { x: 297, y: 210 },
  { x: 0, y: 210 },
  { x: 297, y: 0 },
  { x: 0, y: 0 },
];
const landscapeOrdered = orderCorners(structuredClone(landscapeUnordered));
assert.deepEqual(landscapeOrdered, [
  { x: 0, y: 0 },
  { x: 297, y: 0 },
  { x: 297, y: 210 },
  { x: 0, y: 210 },
]);
near(quadrilateralAspectRatio(landscapeOrdered), A4_RATIO, 1e-9, "landscape A4 ratio");

const mildPerspectiveUnordered = [
  { x: 281, y: 226 },
  { x: 18, y: 12 },
  { x: 302, y: 34 },
  { x: 38, y: 215 },
];
const perspectiveOrdered = orderCorners(structuredClone(mildPerspectiveUnordered));
assert.deepEqual(perspectiveOrdered, [
  { x: 18, y: 12 },
  { x: 302, y: 34 },
  { x: 281, y: 226 },
  { x: 38, y: 215 },
]);
near(quadrilateralAspectRatio(perspectiveOrdered), A4_RATIO, 0.12, "mild perspective A4 ratio");

const degenerate = [
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
];
assert.equal(quadrilateralAspectRatio(orderCorners(degenerate)), Number.POSITIVE_INFINITY);

console.log("A4 geometry checks passed.");
