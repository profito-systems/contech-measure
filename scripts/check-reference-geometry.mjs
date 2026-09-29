import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const source = fs.readFileSync(path.join(root, "src", "cv", "detectA4.js"), "utf8");
const loadGeometry = new Function(source + "\nreturn { orderCorners, quadrilateralAspectRatio, referenceOutputGeometry };");
const helpers = loadGeometry();
const orderCorners = helpers.orderCorners;
const quadrilateralAspectRatio = helpers.quadrilateralAspectRatio;
const referenceOutputGeometry = helpers.referenceOutputGeometry;

const near = (actual, expected, tolerance, label) => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    label + ": expected " + expected.toFixed(4) + ", got " + actual.toFixed(4),
  );
};

const portraitA4 = [
  { x: 0, y: 0 },
  { x: 210, y: 0 },
  { x: 210, y: 297 },
  { x: 0, y: 297 },
];
near(quadrilateralAspectRatio(orderCorners(structuredClone(portraitA4))), 297 / 210, 1e-9, "portrait A4 ratio");
const a4Geometry = referenceOutputGeometry(orderCorners(structuredClone(portraitA4)), 297, 210);
assert.equal(a4Geometry.widthMm, 210);
assert.equal(a4Geometry.heightMm, 297);

const landscapeCard = [
  { x: 0, y: 0 },
  { x: 856, y: 0 },
  { x: 856, y: 540 },
  { x: 0, y: 540 },
];
near(quadrilateralAspectRatio(orderCorners(structuredClone(landscapeCard))), 85.6 / 53.98, 0.003, "ID-1 card ratio");
const cardGeometry = referenceOutputGeometry(orderCorners(structuredClone(landscapeCard)), 85.6, 53.98);
assert.equal(cardGeometry.widthMm, 85.6);
assert.equal(cardGeometry.heightMm, 53.98);

const customPortrait = [
  { x: 0, y: 0 },
  { x: 60, y: 0 },
  { x: 60, y: 100 },
  { x: 0, y: 100 },
];
const customGeometry = referenceOutputGeometry(orderCorners(structuredClone(customPortrait)), 100, 60);
assert.equal(customGeometry.widthMm, 60);
assert.equal(customGeometry.heightMm, 100);

const mildPerspective = [
  { x: 281, y: 226 },
  { x: 18, y: 12 },
  { x: 302, y: 34 },
  { x: 38, y: 215 },
];
const perspectiveOrdered = orderCorners(structuredClone(mildPerspective));
assert.deepEqual(perspectiveOrdered, [
  { x: 18, y: 12 },
  { x: 302, y: 34 },
  { x: 281, y: 226 },
  { x: 38, y: 215 },
]);
near(quadrilateralAspectRatio(perspectiveOrdered), 297 / 210, 0.12, "mild perspective ratio");

const degenerate = [
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
];
assert.equal(quadrilateralAspectRatio(orderCorners(degenerate)), Number.POSITIVE_INFINITY);

console.log("Reference geometry checks passed.");
