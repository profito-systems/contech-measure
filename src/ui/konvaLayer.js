(function () {
  window.initKonvaLayer = function (inputCanvas) {
    const containerId = 'konva-container';
    let container = document.getElementById(containerId);

    if (window._konva?.stage) window._konva.stage.destroy();

    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.style.position = 'relative';
      inputCanvas.parentNode.insertBefore(container, inputCanvas);
      container.appendChild(inputCanvas);
    }

    const stage = new Konva.Stage({
      container: containerId,
      width: inputCanvas.width,
      height: inputCanvas.height,
    });
    const layer = new Konva.Layer();
    stage.add(layer);
    window._konva = { stage, layer };
  };

  window.setKonvaCorners = function (corners) {
    if (!window._konva?.layer) return;
    const { layer } = window._konva;
    layer.destroyChildren();

    corners.forEach((corner) => {
      layer.add(new Konva.Circle({
        x: corner.x,
        y: corner.y,
        radius: 8,
        fill: 'red',
        listening: false,
      }));
    });

    layer.draw();
  };
})();
