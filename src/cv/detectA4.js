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

      for (let i = 0; i < contours.size(); i++) {
        const cnt = contours.get(i);
        const peri = cv.arcLength(cnt, true);
        const approx = new cv.Mat();
        cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

        if (approx.rows === 4 && cv.isContourConvex(approx)) {
          const area = cv.contourArea(approx);
          if (area > maxArea) {
            maxArea = area;
            if (best) best.delete();
            best = approx;
          } else approx.delete();
        } else approx.delete();

        cnt.delete();
      }

      if (!best) return resolve(null);

      const corners = [];
      for (let i = 0; i < 4; i++) {
        corners.push({ x: best.intPtr(i,0)[0], y: best.intPtr(i,0)[1] });
      }

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

function orderCorners(pts) {
  pts.sort((a,b) => a.x + a.y - (b.x + b.y));
  const tl = pts[0];
  const br = pts[3];
  const mid = [pts[1], pts[2]];
  const tr = mid[0].x > mid[1].x ? mid[0] : mid[1];
  const bl = mid[0].x > mid[1].x ? mid[1] : mid[0];
  return [tl, tr, br, bl];
}
