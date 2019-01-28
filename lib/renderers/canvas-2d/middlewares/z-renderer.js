import createCanvas from '../../../utils/create-canvas';

export default class ZRenderer {
  constructor () {
    this._templates = {};
  }

  // TODO: we may use memorization by option instead
  _getShadowCanvas (targetCanvas) {
    if (!this._shadowCanvas) {
      this._shadowCanvas = createCanvas();
      this._shadowCanvas.width = targetCanvas.width;
      this._shadowCanvas.height = targetCanvas.height;
    }
    return this._shadowCanvas;
  }

  // TODO: we may use memorization by option
  _getShadowCanvasCtx (targetCanvas) {
    return this._getShadowCanvas(targetCanvas).getContext('2d');
  }

  _getTemplate (radius) {
    if (!this._templates[radius]) {
      const templateCanvas = createCanvas();
      templateCanvas.width = 2 * radius + 1;
      templateCanvas.height = 2 * radius + 1;

      const templateCtx = templateCanvas.getContext('2d');
      templateCtx.beginPath();
      templateCtx.arc(radius, radius, radius, 0, 2 * Math.PI, false);
      templateCtx.fillStyle = 'rgba(0,0,0,1)';
      templateCtx.fill();

      this._templates[radius] = templateCanvas;
    }

    return this._templates[radius];
  }

  async process (ctx) {
    const { data, target } = ctx;
    const shadowCanvasCtx = this._getShadowCanvasCtx(target);

    for (let i = 0; i < data.length; i++) {
      const [x, y, ...values] = data[i];
      // TODO: we could have multiple values which would mean (readius, alpha and etc.)
      const radius = Math.round(values[0]);
      const template = this._getTemplate(radius);
      shadowCanvasCtx.globalAlpha = values[1];
      shadowCanvasCtx.drawImage(template, x - radius, y - radius);
    }

    const { width, height } = shadowCanvasCtx.canvas;
    ctx.z = shadowCanvasCtx.getImageData(0, 0, width, height).data;

    return ctx;
  }
}
