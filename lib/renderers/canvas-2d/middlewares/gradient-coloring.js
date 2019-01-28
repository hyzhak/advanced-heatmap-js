export default class GradientColoring {
  async process (ctx) {
    // TODO: fix me
    const { data, target } = ctx;

    const canvasCtx = target.getContext('2d');

    data.forEach(([x, y, ...values]) => {
      const r = values[0];
      canvasCtx.beginPath();
      canvasCtx.arc(x, y, r, 0, Math.PI * 2, true);
      canvasCtx.closePath();
      canvasCtx.fill();
    });

    return ctx;
  }
}
