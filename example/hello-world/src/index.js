import HeatMap from '../../..'

function createHeatmap () {
  const width = 256;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const hp = new HeatMap({
    canvas
  });

  const numOfPoints = 1000;

  let x = width / 2;
  let y = height / 2;

  // Brownian (random) motion
  const step = 10;
  for (let i = 0; i < numOfPoints; i++) {
    x += step * Math.random() - 5;
    y += step * Math.random() - 5;
    if (x > width) {
      x -= width;
    } else if (x < 0) {
      x += width;
    }
    if (y > height) {
      y -= height;
    } else if (y < 0) {
      y += height;
    }
    hp.add([x, y, 10 * Math.random()]);
  }

  console.time('render');
  hp.render().then(() => {
    console.timeEnd('render');
  });

  return canvas;
}

document.body.appendChild(createHeatmap());
