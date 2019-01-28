import HeatMap from '../../..'

function createHeatmap () {
  const width = 512;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const hp = new HeatMap({
    canvas,
    smooth: 0.5,

    features: {
      alpha: {
        source: {
          idx: 2,
          min: 0,
          max: 1
        },

        value: {
          min: 0.1,
          max: 0.2
        }
      },

      radius: {
        source: {
          idx: 3,
          min: -1,
          max: 1,
        },

        value: {
          min: 1,
          max: 8
        }
      }
    }
  });

  const numOfPoints = 1000;

  let x = width / 2;
  let y = height / 2;

  // Brownian (random) motion
  const step = 8;
  for (let i = 0; i < numOfPoints; i++) {
    x += step * Math.random() - step / 2;
    y += step * Math.random() - step / 2;
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
    hp.add([x, y, 16 * Math.random(), 0.1 + 0.2 * Math.random()]);
  }

  console.time('render');
  hp.render().then(() => {
    console.timeEnd('render');
  });

  return canvas;
}


function staticData () {
  document.body.appendChild(createHeatmap());
}

function dynamicData () {
  const width = 512;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  document.body.appendChild(canvas);

  const heatmap = new HeatMap({
    canvas,
    smooth: 0.5,

    features: {
      alpha: {
        source: {
          idx: 2,
          min: 0,
          max: 1
        },

        value: {
          min: 0.1,
          max: 0.2
        }
      },

      radius: {
        source: {
          idx: 3,
          min: -1,
          max: 1,
        },

        value: {
          min: 1,
          max: 8
        }
      }
    }
  });

  let x = width / 2;
  let y = height / 2;
  let dx = 0;
  let dy = 0;

  const maxD = 8;
  const maxDD = 2;

  let step = 0;

  setInterval(() => {
    step++;
    heatmap.add([
      x, y,
      Math.random(),
      Math.sin(step / 100)
    ]);

    dx += maxDD * Math.random() - maxDD / 2;
    dy += maxDD * Math.random() - maxDD / 2;

    dx = Math.max(Math.min(dx, maxD), -maxD);
    dy = Math.max(Math.min(dy, maxD), -maxD);

    x += dx;
    y += dy;

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

    console.time(`render: ${step}`);
    heatmap.render().then(() => {
      console.timeEnd(`render: ${step}`);
    });
  }, 1000 / 60);
}

// staticData();
dynamicData();
