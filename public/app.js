const fileInput = document.getElementById('file');
const fileNameEl = document.getElementById('fileName');
const inputCanvas = document.getElementById('inputCanvas');
const warpedCanvas = document.getElementById('warpedCanvas');
const canvasesEl = document.getElementById('canvases');
const resultEl = document.getElementById('result');
const autoBtn = document.getElementById('autoDetectBtn');
const sampleBtn = document.getElementById('sampleBtn');

let currentImage = null;
let activeObjectUrl = null;

function setStatus(message, tone = '') {
  resultEl.textContent = message;
  resultEl.className = `status ${tone}`.trim();
}

function pointDistance(first, second) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function a4OutputGeometry(corners, pixelsPerMillimetre = 4) {
  const averageWidth = (
    pointDistance(corners[0], corners[1]) +
    pointDistance(corners[3], corners[2])
  ) / 2;
  const averageHeight = (
    pointDistance(corners[0], corners[3]) +
    pointDistance(corners[1], corners[2])
  ) / 2;
  const landscape = averageWidth > averageHeight;
  const widthMm = landscape ? 297 : 210;
  const heightMm = landscape ? 210 : 297;

  return {
    orientation: landscape ? 'pozioma' : 'pionowa',
    widthMm,
    heightMm,
    widthPixels: widthMm * pixelsPerMillimetre,
    heightPixels: heightMm * pixelsPerMillimetre,
  };
}

function loadImageFile(file) {
  currentImage = null;
  autoBtn.disabled = true;
  fileNameEl.textContent = file.name;
  setStatus('Wczytuję zdjęcie…');

  const img = new Image();
  if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
  const objectUrl = URL.createObjectURL(file);
  activeObjectUrl = objectUrl;
  img.src = objectUrl;

  img.onload = () => {
    if (activeObjectUrl !== objectUrl) return;
    URL.revokeObjectURL(objectUrl);
    activeObjectUrl = null;

    const maxSide = 1800;
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    inputCanvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    inputCanvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    inputCanvas.getContext('2d').drawImage(img, 0, 0, inputCanvas.width, inputCanvas.height);

    currentImage = img;
    autoBtn.disabled = false;
    canvasesEl.classList.remove('is-hidden');
    setStatus('Zdjęcie gotowe. Uruchom wykrywanie kartki A4.', 'is-success');
    if (window.initKonvaLayer) window.initKonvaLayer(inputCanvas, warpedCanvas);
  };

  img.onerror = () => {
    if (activeObjectUrl !== objectUrl) return;
    URL.revokeObjectURL(objectUrl);
    activeObjectUrl = null;
    fileNameEl.textContent = 'Nie udało się wczytać pliku';
    setStatus('Nie udało się otworzyć zdjęcia. Wybierz inny plik.', 'is-error');
  };
}

fileInput.addEventListener('change', (event) => {
  const file = event.target.files.item(0);
  if (file) loadImageFile(file);
});
sampleBtn.addEventListener('click', async () => {
  sampleBtn.disabled = true;
  setStatus('Wczytuję bezpieczny wzorzec A4…');

  try {
    const response = await fetch('sample-a4.jpg');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    loadImageFile(new File(Array.of(blob), 'wzorzec-miarka-a4.jpg', { type: blob.type }));
  } catch (error) {
    console.error(error);
    setStatus('Nie udało się wczytać wzorca. Spróbuj ponownie.', 'is-error');
  } finally {
    sampleBtn.disabled = false;
  }
});

autoBtn.addEventListener('click', async () => {
  if (!currentImage) {
    setStatus('Najpierw wybierz zdjęcie z urządzenia.', 'is-warning');
    return;
  }

  if (typeof cv === 'undefined' || !cv.imread || typeof detectA4 !== 'function' || typeof warpToA4 !== 'function') {
    setStatus('Moduł pomiarowy jeszcze się uruchamia. Odczekaj chwilę i spróbuj ponownie.', 'is-warning');
    return;
  }

  autoBtn.disabled = true;
  autoBtn.textContent = 'Wykrywam kartkę…';
  setStatus('Analizuję krawędzie i narożniki kartki A4…');

  try {
    const corners = await detectA4(inputCanvas);
    if (!corners) {
      setStatus('Nie wykryłem wiarygodnie całej kartki. Użyj oryginalnego zdjęcia zamiast zrzutu ekranu, zbliż telefon i pokaż cztery narożniki A4.', 'is-warning');
      return;
    }

    if (window.setKonvaCorners) window.setKonvaCorners(corners);

    const geometry = a4OutputGeometry(corners);
    warpedCanvas.width = geometry.widthPixels;
    warpedCanvas.height = geometry.heightPixels;
    warpToA4(inputCanvas, corners, warpedCanvas);

    const mmPerPixelX = geometry.widthMm / warpedCanvas.width;
    const mmPerPixelY = geometry.heightMm / warpedCanvas.height;
    window.measurement = {
      mmPerPixelX,
      mmPerPixelY,
      orientation: geometry.orientation,
    };

    setStatus(
      `Gotowe. A4: ${geometry.orientation}. Skala wynosi ${mmPerPixelX.toFixed(4)} mm na piksel.`,
      'is-success',
    );
  } catch (error) {
    console.error(error);
    setStatus('Wystąpił błąd podczas analizy. Spróbuj ponownie lub wybierz inne zdjęcie.', 'is-error');
  } finally {
    autoBtn.disabled = false;
    autoBtn.textContent = 'Wykryj kartkę A4';
  }
});
