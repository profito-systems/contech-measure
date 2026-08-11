const fileInput = document.getElementById('file');
const inputCanvas = document.getElementById('inputCanvas');
const warpedCanvas = document.getElementById('warpedCanvas');
const resultEl = document.getElementById('result');
const autoBtn = document.getElementById('autoDetectBtn');
const sampleBtn = document.getElementById('sampleBtn');

let currentImage = null;
let activeObjectUrl = null;

function loadImageFile(file) {
  currentImage = null;
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
}

fileInput.addEventListener('change', (event) => {
  const file = event.target.files.item(0);
  if (file) loadImageFile(file);
});

sampleBtn.addEventListener('click', async () => {
  sampleBtn.disabled = true;
  resultEl.textContent = 'Wczytuję bezpieczny wzorzec A4...';

  try {
    const response = await fetch('sample-a4.jpg');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    loadImageFile(new File(Array.of(blob), 'wzorzec-miarka-a4.jpg', { type: blob.type }));
  } catch (error) {
    console.error(error);
    resultEl.textContent = 'Nie udało się wczytać wzorca. Spróbuj ponownie.';
  } finally {
    sampleBtn.disabled = false;
  }
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
    resultEl.textContent = 'Nie wykryto wiarygodnie kartki A4. Użyj oryginalnego zdjęcia, zbliż telefon i pokaż cztery narożniki.';
    return;
  }

  if (window.setKonvaCorners) window.setKonvaCorners(corners);
  warpToA4(inputCanvas, corners, warpedCanvas);

  const mmPerPixelX = 210 / warpedCanvas.width;
  const mmPerPixelY = 297 / warpedCanvas.height;

  window.measurement = { mmPerPixelX, mmPerPixelY };

  resultEl.textContent = `Skala: ${mmPerPixelX.toFixed(4)} mm/px`;
});
