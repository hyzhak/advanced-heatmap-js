import { GradientColoring, ZRenderer } from './middlewares'

export default class Canvas2DRenderer {
  constructor ({ features, smooth, valueToOpacity }) {
    this._pipeline = []
    this._pipeline.push(new ZRenderer({ features, smooth }))
    this._pipeline.push(new GradientColoring({ valueToOpacity }))
  }

  /**
   * render data to target
   *
   * @param target
   * @param data
   * @returns {Promise<*>}
   */
  async render ({ target, data }) {
    const res = await this._pipeline.reduce(async (ctx, middleware) => {
      ctx = await ctx
      return middleware.process(ctx)
    }, { data, target })

    return res.target
  }
}
