// Maps per-zone plot polygons (zone-view camera space) onto the masterplan
// image (frame 77 camera space) via a per-zone homography solved from
// correspondences between the plot-cloud hull corners (zone space) and the
// zone boundary polygon scraped from the live masterplan (77-space).
const fs = require('fs');
const path = require('path');

const DATA = 'C:\\Users\\usman\\Desktop\\madebyusman\\ALLAHABC - Copy - Copy\\alaqtar-replica\\data';

// Zone boundary polygons in masterplan (77.jpg, 1920x1080) space — scraped live.
const MP_BOUNDS = {
  1: [[950.546,342.842],[272.539,635.909],[210.126,571.17],[160.506,424.637],[822.62,274.227]],
  2: [[583.612,926.656],[272.907,635.789],[744.106,432.081],[1074.89,641.145]],
  3: [[772.449,1035.67],[641.641,942.073],[1432.88,464.77],[1518.93,367.682],[1696.82,445.585]],
  4: [[1079.52,645.319],[926.75,547.808],[1430.91,296.449],[1454.39,305.478],[1496.28,279.475],[1552.26,296.81],[1535.65,310.534],[1425.13,428.991],[1397.69,457.16]],
  5: [[1096,213],[828,274],[1136,443.5],[1430,298],[1452,306],[1487.5,287],[1432.5,262.5],[1386,284],[1316,259],[1407.5,216],[1316,193],[1161,203]],
};

function parsePath(d) {
  const pts = [];
  const re = /[ML]\s*(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g;
  let m;
  while ((m = re.exec(d))) pts.push([parseFloat(m[1]), parseFloat(m[2])]);
  return pts;
}

// Andrew monotone chain convex hull
function convexHull(points) {
  const pts = [...points].sort((a,b) => a[0]-b[0] || a[1]-b[1]);
  const cross = (o,a,b) => (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0]);
  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length-2], lower[lower.length-1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = pts.length-1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length-2], upper[upper.length-1], p) <= 0) upper.pop();
    upper.push(p);
  }
  lower.pop(); upper.pop();
  return lower.concat(upper); // counter-clockwise in image coords? (y down -> clockwise visually)
}

// Simplify a convex polygon to exactly k corners: iteratively remove the vertex
// whose removal loses the least area.
function simplifyHull(hull, k) {
  const pts = hull.map(p => [...p]);
  const triArea = (a,b,c) => Math.abs((b[0]-a[0])*(c[1]-a[1]) - (c[0]-a[0])*(b[1]-a[1]))/2;
  while (pts.length > k) {
    let best = -1, bestLoss = Infinity;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[(i-1+pts.length)%pts.length], b = pts[i], c = pts[(i+1)%pts.length];
      const loss = triArea(a,b,c);
      if (loss < bestLoss) { bestLoss = loss; best = i; }
    }
    pts.splice(best, 1);
  }
  return pts;
}

// Solve homography H (3x3, h33=1) mapping src[i] -> dst[i], least squares via normal equations.
function solveHomography(src, dst) {
  // Build A x = b with 8 unknowns
  const n = src.length;
  const A = [], b = [];
  for (let i = 0; i < n; i++) {
    const [x,y] = src[i], [u,v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u*x, -u*y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v*x, -v*y]); b.push(v);
  }
  // Normal equations: (A^T A) h = A^T b
  const AtA = Array.from({length:8}, () => new Array(8).fill(0));
  const Atb = new Array(8).fill(0);
  for (let r = 0; r < A.length; r++) {
    for (let i = 0; i < 8; i++) {
      Atb[i] += A[r][i]*b[r];
      for (let j = 0; j < 8; j++) AtA[i][j] += A[r][i]*A[r][j];
    }
  }
  // Gaussian elimination
  const M = AtA.map((row,i) => [...row, Atb[i]]);
  for (let col = 0; col < 8; col++) {
    let piv = col;
    for (let r = col+1; r < 8; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    [M[col], M[piv]] = [M[piv], M[col]];
    if (Math.abs(M[col][col]) < 1e-12) return null;
    for (let r = 0; r < 8; r++) {
      if (r === col) continue;
      const f = M[r][col]/M[col][col];
      for (let c = col; c <= 8; c++) M[r][c] -= f*M[col][c];
    }
  }
  const h = M.map((row,i) => row[8]/row[i]);
  return [[h[0],h[1],h[2]],[h[3],h[4],h[5]],[h[6],h[7],1]];
}

function applyH(H, [x,y]) {
  const w = H[2][0]*x + H[2][1]*y + H[2][2];
  return [(H[0][0]*x + H[0][1]*y + H[0][2])/w, (H[1][0]*x + H[1][1]*y + H[1][2])/w];
}

function reprojError(H, src, dst) {
  let e = 0;
  for (let i = 0; i < src.length; i++) {
    const p = applyH(H, src[i]);
    e += Math.hypot(p[0]-dst[i][0], p[1]-dst[i][1]);
  }
  return e/src.length;
}

// Try all cyclic rotations and both directions of corner ordering; pick min error.
function bestHomography(srcCorners, dstCorners) {
  const k = dstCorners.length;
  let best = null, bestErr = Infinity, bestMeta = null;
  for (const rev of [false, true]) {
    const s = rev ? [...srcCorners].reverse() : srcCorners;
    for (let off = 0; off < k; off++) {
      const rot = s.map((_,i) => s[(i+off)%k]);
      const H = solveHomography(rot, dstCorners);
      if (!H) continue;
      const err = reprojError(H, rot, dstCorners);
      if (err < bestErr) { bestErr = err; best = H; bestMeta = {rev, off}; }
    }
  }
  return {H: best, err: bestErr, meta: bestMeta};
}

// Distance from point to polygon outline (closest edge)
function distToPolygon(p, poly) {
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i+1)%poly.length];
    const dx = b[0]-a[0], dy = b[1]-a[1];
    const len2 = dx*dx + dy*dy;
    let t = len2 ? ((p[0]-a[0])*dx + (p[1]-a[1])*dy)/len2 : 0;
    t = Math.max(0, Math.min(1, t));
    const d = Math.hypot(p[0]-(a[0]+t*dx), p[1]-(a[1]+t*dy));
    if (d < best) best = d;
  }
  return best;
}

const zonesPolys = JSON.parse(fs.readFileSync(path.join(DATA, 'zones-polygons.json'), 'utf8'));
const out = {};
for (const zone of [1,2,3,4,5]) {
  const plots = zonesPolys['zone'+zone];
  if (!plots) { console.log(`zone${zone}: MISSING`); continue; }
  const allPts = plots.flatMap(p => parsePath(p.path));
  const hull = convexHull(allPts);
  const dstBoundary = MP_BOUNDS[zone];
  const dstHullFull = convexHull(dstBoundary);

  let H = null, bestScore = Infinity, bestInfo = '';
  const maxK = Math.min(hull.length, dstHullFull.length, 8);
  for (let K = 4; K <= maxK; K++) {
    const srcC = simplifyHull(hull, K);
    const dstC = simplifyHull(dstHullFull, K);
    const cand = bestHomography(srcC, dstC);
    if (!cand.H) continue;
    // Score: mean distance of full projected src hull to dst boundary outline
    const score = hull.reduce((s,p) => s + distToPolygon(applyH(cand.H, p), dstBoundary), 0) / hull.length;
    if (score < bestScore) { bestScore = score; H = cand.H; bestInfo = `K=${K} cornerErr=${cand.err.toFixed(1)}`; }
  }
  console.log(`zone${zone}: plots=${plots.length} hull=${hull.length} score=${bestScore.toFixed(2)}px ${bestInfo}`);
  // Roof-height correction: plots are ground footprints; in the oblique render
  // the visible roofs project up-screen relative to the ground plane.
  const OFFSETS = { 1: [-8, -8], 2: [-16, -17], 3: [-8, -8], 4: [-15, -14], 5: [-14, -14] };
  const [ox, oy] = OFFSETS[zone] || [0, 0];
  out['zone'+zone] = plots.map(p => {
    const pts = parsePath(p.path).map(pt => {
      const q = applyH(H, pt);
      return [q[0] + ox, q[1] + oy];
    });
    const d = 'M' + pts.map(pt => `${pt[0].toFixed(2)} ${pt[1].toFixed(2)}`).join('L') + 'Z';
    return { plotIndex: p.plotIndex, path: d };
  });
}
fs.writeFileSync(path.join(DATA, 'masterplan-plot-polygons.json'), JSON.stringify(out));
console.log('written masterplan-plot-polygons.json');
