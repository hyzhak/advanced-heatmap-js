import { Canvas2DRenderer } from './renderers/canvas-2d'

class HeatMap {
  constructor ({ canvas, data = [], features = {}, smooth = 0.5, valueToOpacity = false } = {}) {
    this._canvas = canvas
    this._data = data
    this._renderer = new Canvas2DRenderer({ features, smooth, valueToOpacity })
  }

  add ([x, y, ...values]) {
    this._data.push([x, y, ...values])

    return this
  }

  addAll () {

  }

  remove () {

  }

  removeAll () {
    this._data = []
  }

  gradient () {

  }

  resize () {

  }

  clear () {
    const context = this._canvas.getContext('2d')
    context.clearRect(0, 0, this._canvas.width, this._canvas.height)
  }

  async render () {
    await this._renderer.render({
      data: this._data,
      target: this._canvas
    })
  }
}

export default HeatMap
