import { Canvas2DRenderer } from './renderers/canvas-2d'

class HeatMap {
  constructor ({ canvas, data = [] }) {
    this._canvas = canvas;
    this._data = data;
    this._renderer = new Canvas2DRenderer({
      canvas, data
    });
  }

  add ([x, y, ...values]) {
    this._data.push([x, y, ...values]);

    return this;
  }

  addAll () {

  }

  remove () {

  }

  removeAll () {

  }

  gradient () {

  }

  resize () {

  }

  async render () {
    await this._renderer.render({
      data: this._data,
      target: this._canvas
    });
  }
}

export default HeatMap;
