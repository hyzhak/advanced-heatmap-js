class HeatMap {
  constructor ({ canvas }) {
    this._canvas = canvas;
    this._data = [];
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

  render () {
    const ctx = this._canvas.getContext('2d');

    this._data.forEach(([x, y, ...values]) => {
      const r = values[0];
      const r2 = r;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    });
  }
}

module.exports = HeatMap;
