import createCanvas from '../../../utils/create-canvas';

export default class GradientColoring {
  constructor () {
    this._buildGradient({
      0.0: 'darkblue',
      0.25: 'green',
      0.5: 'yellow',
      0.75: 'orange',
      1.0: 'red'
    });
  }

  /**
   * build gradient template value to color scheme
   *
   * @param colors
   * @private
   */
  _buildGradient (colors) {
    // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
    const gradientLength = 256;
    const gradientCanvas = createCanvas();
    const gradientCtx = gradientCanvas.getContext('2d');
    const gradient = gradientCtx.createLinearGradient(0, 0, 0, gradientLength);

    gradientCanvas.width = 1;
    gradientCanvas.height = gradientLength;

    Object.entries(colors)
      .forEach(([value, color]) => gradient.addColorStop(value, color));

    gradientCtx.fillStyle = gradient;
    gradientCtx.fillRect(0, 0, 1, 256);

    this._valueToColor = gradientCtx.getImageData(0, 0, 1, 256).data;
  }

  /**
   * map z to color and render it to target
   *
   * @param ctx
   * @returns {Promise<*>}
   */
  async process (ctx) {
    const { target, z } = ctx;

    const { width, height } = target;

    // TODO: we cache it
    const targetCtx = target.getContext('2d');
    // TODO: we cache it
    const targetImageData = targetCtx.createImageData(width, height);
    const targetData = targetImageData.data;

    for (let i = 0; i < z.length; i += 4) {
      const zValue = z[i + 3];
      const index = 4 * zValue;
      targetData[i] = this._valueToColor[index];
      targetData[i + 1] = this._valueToColor[index + 1];
      targetData[i + 2] = this._valueToColor[index + 2];
      targetData[i + 3] = 256; // can use zValue for gradient opacity
    }

    targetCtx.putImageData(targetImageData, 0, 0);

    return ctx;
  }
}
