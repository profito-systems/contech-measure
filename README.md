# Contech Measure / Miarka Profito

Canonical development source for the Profito browser measurement tool.

## Current measurement model

Miarka v2 can calibrate a photograph from:

- A4 paper, 210 × 297 mm
- an ISO/IEC 7810 ID-1 sized card, 85.60 × 53.98 mm
- any flat rectangular object with two known dimensions

The card option is intended for non-sensitive objects such as loyalty, gift or access cards in the standard ID-1 format. Users should not photograph payment-card details or identity-document data.

After calibration the UI can measure two line segments on the same physical plane as the reference object and calculate a rectangular area. A manual four-corner mode is available when automatic rectangle detection is unreliable.

## Accuracy boundary

This is a practical estimation tool, not a surveying instrument. Perspective correction assumes the reference object and measured points are on the same flat plane. Measurements spanning different planes, curved surfaces or strong depth changes are not reliable.

## Development

Run:

npm run check

The checks validate JavaScript syntax, production assembly and reference geometry for A4, ID-1 and custom rectangles.

## Source of truth

This repository main branch is the canonical Miarka source. The production copy under profito-systems.github.io/miarka should only be updated one-way from a tested canonical revision.
