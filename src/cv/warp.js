function warpToA4(inputCanvas, corners, warpedCanvas) {
  const src = cv.imread(inputCanvas);
  const dst = new cv.Mat();
  const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, Array.of(
    corners[0].x, corners[0].y,
    corners[1].x, corners[1].y,
    corners[2].x, corners[2].y,
    corners[3].x, corners[3].y,
  ));

  const width = warpedCanvas.width;
  const height = warpedCanvas.height;
  const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, Array.of(
    0, 0,
    width - 1, 0,
    width - 1, height - 1,
    0, height - 1,
  ));

  const transform = cv.getPerspectiveTransform(srcTri, dstTri);
  cv.warpPerspective(src, dst, transform, new cv.Size(width, height));
  cv.imshow(warpedCanvas, dst);

  srcTri.delete();
  dstTri.delete();
  transform.delete();
  src.delete();
  dst.delete();
}
