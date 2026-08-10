const fileInput = document.getElementById('file');
const inputCanvas = document.getElementById('inputCanvas');
const warpedCanvas = document.getElementById('warpedCanvas');
const resultEl = document.getElementById('result');
const autoBtn = document.getElementById('autoDetectBtn');

let currentImage = null;
let activeObjectUrl = null;

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
  const objectUrl = URL.createObjectURL(file);
  activeObjectUrl = objectUrl;
  img.src = objectUrl;

  img.onload = () => {
    if (activeObjectUrl !== objectUrl) return;
    URL.revokeObjectURL(objectUrl);
    activeObjectUrl = null;
    currentImage = img;
    inputCanvas.width = img.width;
    inputCanvas.height = img.height;
    const ctx = inputCanvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    resultEl.textContent = 'Obraz załadowany.';
    if (window.initKonvaLayer) window.initKonvaLayer(inputCanvas, warpedCanvas);
  };

  img.onerror = () => {
    if (activeObjectUrl !== objectUrl) return;
    URL.revokeObjectURL(objectUrl);
    activeObjectUrl = null;
    currentImage = null;
    resultEl.textContent = 'Nie udało się wczytać wybranego obrazu.';
  };
});

autoBtn.addEventListener('click', async () => {
  if (!currentImage) {
    resultEl.textContent = 'Wgraj zdjęcie najpierw.';
    return;
  }

  resultEl.textContent = 'Wykrywanie...';

  if (typeof cv === 'undefined' || !cv.imread || typeof detectA4 !== 'function' || typeof warpToA4 !== 'function') {
    resultEl.textContent = 'OpenCV.js nie załadowany jeszcze. Odczekaj chwilę.';
    return;
  }

  const corners = await detectA4(inputCanvas);
  if (!corners) {
    resultEl.textContent = 'Nie wykryto kartki A4.';
    return;
  }

  if (window.setKonvaCorners) window.setKonvaCorners(corners);
  warpToA4(inputCanvas, corners, warpedCanvas);

  const mmPerPixelX = 210 / warpedCanvas.width;
  const mmPerPixelY = 297 / warpedCanvas.height;

  window.measurement = { mmPerPixelX, mmPerPixelY };

  resultEl.textContent = `Skala: ${mmPerPixelX.toFixed(4)} mm/px`;
});
