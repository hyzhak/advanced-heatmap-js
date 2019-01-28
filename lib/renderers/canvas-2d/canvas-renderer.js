import { GradientColoring, ZRenderer } from './middlewares';

export default class Canvas2DRenderer {
  constructor () {
    this._pipeline = [];
    this._pipeline.push(new ZRenderer());
    this._pipeline.push(new GradientColoring());
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
      ctx = await ctx;
      return await middleware.process(ctx);
    }, { data, target });

    console.log('res', res);
    return res.target;
  }

}
