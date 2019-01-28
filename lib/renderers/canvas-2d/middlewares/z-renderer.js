import createCanvas from '../../../utils/create-canvas';

export default class ZRenderer {
  constructor ({
    features,
    smooth = 0.5
  } = {}) {
    this._features = features;
    this._templates = {};
    this._options = {
      smooth
    };
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

      // TODO: should it be global or local option?
      const { smooth } = this._options;
      if (smooth === 1) {
        templateCtx.beginPath();
        templateCtx.arc(radius, radius, radius, 0, 2 * Math.PI, false);
        templateCtx.fillStyle = 'rgba(0,0,0,1)';
        templateCtx.fill();
      } else {
        // make it smooth
        let gradient = templateCtx.createRadialGradient(
          radius, radius, radius * smooth,
          radius, radius, radius
        );
        gradient.addColorStop(0, 'rgba(0,0,0,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        templateCtx.fillStyle = gradient;
        templateCtx.fillRect(0, 0, 2 * radius + 1, 2 * radius + 1);
      }

      this._templates[radius] = templateCanvas;
    }

    return this._templates[radius];
  }

  _extractFeature (featureScheme, values) {
    const value = values[featureScheme.source.idx];
    const normalizedValue = (value - featureScheme.source.min) / (featureScheme.source.max - featureScheme.source.min);
    return featureScheme.value.min + (featureScheme.value.max - featureScheme.value.min) * normalizedValue;
  }

  async process (ctx) {
    console.time('z-renderer:process');
    const { data, target } = ctx;
    const shadowCanvasCtx = this._getShadowCanvasCtx(target);

    const { width, height } = shadowCanvasCtx.canvas;

    // TODO: we may need to cache canvas between frames and only apply difference
    shadowCanvasCtx.clearRect(0, 0, width, height);

    for (let i = 0; i < data.length; i++) {
      const [x, y] = data[i];
      const radius = Math.round(this._extractFeature(this._features.radius, data[i]));
      const template = this._getTemplate(radius);
      shadowCanvasCtx.globalAlpha = this._extractFeature(this._features.alpha, data[i]);
      shadowCanvasCtx.drawImage(template, x - radius, y - radius);
    }

    ctx.z = shadowCanvasCtx.getImageData(0, 0, width, height).data;
    console.timeEnd('z-renderer:process');
    return ctx;
  }
}
