import HeatMap from '../../..'

function createHeatmap () {
  // let element = document.createElement('div');
  // element.innerHTML = ['Hello', 'advanced', 'heatmap'].join(' ');

  const canvas = document.createElement('canvas');

  const hp = new HeatMap({
    canvas
  });

  const numOfPoints = 100;

  for (let i = 0; i < numOfPoints; i++) {
    hp.add([256 * Math.random(), 256 * Math.random(), 10 * Math.random()]);
  }

  hp.render();

  return canvas;
}

document.body.appendChild(createHeatmap());
