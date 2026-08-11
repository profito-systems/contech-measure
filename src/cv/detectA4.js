async function detectA4(canvas) {
  return new Promise((resolve) => {
    let src;
    let gray;
    let contours;
    let hierarchy;
    let best;

    try {
      src = cv.imread(canvas);
      gray = new cv.Mat();

      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      cv.GaussianBlur(gray, gray, new cv.Size(5,5), 0);
      cv.Canny(gray, gray, 50, 150);

      contours = new cv.MatVector();
      hierarchy = new cv.Mat();
      cv.findContours(gray, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

      let maxArea = 0;
      const imageArea = src.rows * src.cols;
      const a4AspectRatio = 297 / 210;

      for (let i = 0; i < contours.size(); i++) {
        const cnt = contours.get(i);
        const peri = cv.arcLength(cnt, true);
        const approx = new cv.Mat();
        cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

        if (approx.rows === 4 && cv.isContourConvex(approx)) {
          const area = cv.contourArea(approx);
          const corners = cornersFromContour(approx);
          const aspectRatio = quadrilateralAspectRatio(orderCorners(corners));
          const areaShare = area / imageArea;
          const aspectError = Math.abs(aspectRatio - a4AspectRatio) / a4AspectRatio;
          const isCredibleA4 = areaShare >= 0.05 && areaShare <= 0.95 && aspectError <= 0.18;

          if (isCredibleA4 && area > maxArea) {
            maxArea = area;
            if (best) best.delete();
            best = approx;
          } else approx.delete();
        } else approx.delete();

        cnt.delete();
      }

      if (!best) return resolve(null);

      const corners = cornersFromContour(best);

      const ordered = orderCorners(corners);

      resolve(ordered);

    } catch (err) {
      console.error(err);
      resolve(null);
    } finally {
      if (best) best.delete();
      if (hierarchy) hierarchy.delete();
      if (contours) contours.delete();
      if (gray) gray.delete();
      if (src) src.delete();
    }
  });
}

function cornersFromContour(contour) {
  const corners = Array.of();
  for (let i = 0; i < 4; i++) {
    const point = contour.intPtr(i, 0);
    corners.push({ x: point[0], y: point[1] });
  }
  return corners;
}

function pointDistance(first, second) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function quadrilateralAspectRatio(corners) {
  const width = (
    pointDistance(corners[0], corners[1]) +
    pointDistance(corners[3], corners[2])
  ) / 2;
  const height = (
    pointDistance(corners[0], corners[3]) +
    pointDistance(corners[1], corners[2])
  ) / 2;
  return Math.max(width, height) / Math.min(width, height);
}

function orderCorners(pts) {
  pts.sort((a,b) => a.x + a.y - (b.x + b.y));
  const tl = pts[0];
  const br = pts[3];
  const mid = [pts[1], pts[2]];
  const tr = mid[0].x > mid[1].x ? mid[0] : mid[1];
  const bl = mid[0].x > mid[1].x ? mid[1] : mid[0];
  return [tl, tr, br, bl];
}
