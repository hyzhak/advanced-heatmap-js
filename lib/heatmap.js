class HeatMap {
  constructor ({ canvas }) {
    this._canvas = canvas;
  }

  add ([x, y, ...values]) {
    // TODO: store data
    const ctx = this._canvas.getContext('2d');
    const r = values[0];
    const r2 = r;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

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

  }
}

module.exports = HeatMap;
