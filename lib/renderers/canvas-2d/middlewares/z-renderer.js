import createCanvas from '../../../utils/create-canvas'

export default class ZRenderer {
  constructor ({
    features,
    smooth = 0.5
  } = {}) {
    this._features = this._validateFeatureSchemeOfValues(features)
    this._templates = {}
    this._options = {
      smooth
    }
  }

  // TODO: we may use memorization by option instead
  _getShadowCanvas (targetCanvas) {
    if (!this._shadowCanvas) {
      this._shadowCanvas = createCanvas()
      this._shadowCanvas.width = targetCanvas.width
      this._shadowCanvas.height = targetCanvas.height
    }
    return this._shadowCanvas
  }

  // TODO: we may use memorization by option
  _getShadowCanvasCtx (targetCanvas) {
    return this._getShadowCanvas(targetCanvas).getContext('2d')
  }

  _getTemplate (radius) {
    if (!this._templates[radius]) {
      const templateCanvas = createCanvas()
      templateCanvas.width = 2 * radius + 1
      templateCanvas.height = 2 * radius + 1

      const templateCtx = templateCanvas.getContext('2d')

      // TODO: should it be global or local option?
      const { smooth } = this._options
      if (smooth === 1) {
        templateCtx.beginPath()
        templateCtx.arc(radius, radius, radius, 0, 2 * Math.PI, false)
        templateCtx.fillStyle = 'rgba(0,0,0,1)'
        templateCtx.fill()
      } else {
        // make it smooth
        let gradient = templateCtx.createRadialGradient(
          radius, radius, radius * smooth,
          radius, radius, radius
        )
        gradient.addColorStop(0, 'rgba(0,0,0,1)')
        gradient.addColorStop(1, 'rgba(0,0,0,0)')
        templateCtx.fillStyle = gradient
        templateCtx.fillRect(0, 0, 2 * radius + 1, 2 * radius + 1)
      }

      this._templates[radius] = templateCanvas
    }

    return this._templates[radius]
  }

  _getMinMax (data, idx) {
    let min = Number.MAX_VALUE
    let max = -Number.MAX_VALUE
    for (let i = 0; i < data.length; i++) {
      const value = data[i][idx]
      if (min > value) {
        min = value
      }
      if (max < value) {
        max = value
      }
    }

    return { min, max }
  }

  _validateValuesMinMax (value = {}, { min = 0, max = 1 } = {}) {
    if (!Number.isFinite(value.min)) {
      value = { ...value, min }
    }

    if (!Number.isFinite(value.max)) {
      value = { ...value, max }
    }
    return value
  }

  _isValidSourceScheme (scheme) {
    return scheme !== undefined
  }

  _validateFeatureSchemeOfValues (features, defaultAlphaValue = 0.5, defaultRadiusValue = 8) {
    if (features.alpha) {
      if (!this._isValidSourceScheme(features.alpha.source)) {
        features.alpha.value = Number.isFinite(features.alpha.value) ? features.alpha.value : defaultAlphaValue
      } else {
        const newValue = this._validateValuesMinMax(features.alpha.value)
        if (features.alpha.value !== newValue) {
          features = { ...features, alpha: { ...features.alpha, value: newValue } }
        }
      }
    } else {
      features = { ...features, alpha: { value: defaultAlphaValue } }
    }

    if (features.radius) {
      if (!this._isValidSourceScheme(features.radius.source)) {
        features.radius.value = Number.isFinite(features.radius.value) ? features.radius.value : defaultRadiusValue
      } else {
        const newValue = this._validateValuesMinMax(features.radius.value, { max: 16 })
        if (features.radius.value !== newValue) {
          features = { ...features, radius: { ...features.radius, value: newValue } }
        }
      }
    } else {
      features = { ...features, radius: { value: defaultRadiusValue } }
    }

    return features
  }

  _validateSourceScheme (scheme, data) {
    if (!Number.isFinite(scheme.min) || !Number.isFinite(scheme.max)) {
      // process all values to get min and max values
      if (data && data.length > 0) {
        const { min, max } = this._getMinMax(data, scheme.idx)
        scheme = {
          ...scheme,
          min: scheme.min || min,
          max: scheme.max || max
        }
      } else {
        scheme = {
          ...scheme,
          min: 0,
          max: 1
        }
      }
    }

    return scheme
  }

  _validateFeatureSchemeForSource (features, data) {
    if (features.alpha && features.alpha.source) {
      const newSource = this._validateSourceScheme(features.alpha.source, data)
      if (features.alpha.source !== newSource) {
        features = { ...features, alpha: { ...features.alpha, source: newSource } }
      }
    }

    if (features.radius && features.radius.source) {
      const newSource = this._validateSourceScheme(features.radius.source, data)
      if (features.radius.source !== newSource) {
        features = { ...features, radius: { ...features.radius, source: newSource } }
      }
    }

    return features
  }

  _extractFeature (featureScheme, values, defaultValue = null) {
    if (!('source' in featureScheme) || !('idx' in featureScheme.source)) {
      return defaultValue
    }
    const value = values[featureScheme.source.idx]
    const normalizedValue = (value - featureScheme.source.min) / (featureScheme.source.max - featureScheme.source.min)
    return featureScheme.value.min + (featureScheme.value.max - featureScheme.value.min) * normalizedValue
  }

  async process (ctx) {
    console.time('z-renderer:process')
    const { data, target } = ctx
    const shadowCanvasCtx = this._getShadowCanvasCtx(target)

    const { width, height } = shadowCanvasCtx.canvas

    // TODO: we may need to cache canvas between frames and only apply difference
    shadowCanvasCtx.clearRect(0, 0, width, height)

    const featuresScheme = this._validateFeatureSchemeForSource(this._features, data)

    for (let i = 0; i < data.length; i++) {
      const [x, y] = data[i]
      // TODO: if feature wasn't passed use static values of all data
      const radius = Math.round(this._extractFeature(featuresScheme.radius, data[i], featuresScheme.radius.value))
      const template = this._getTemplate(radius)
      shadowCanvasCtx.globalAlpha = this._extractFeature(featuresScheme.alpha, data[i], featuresScheme.alpha.value)
      shadowCanvasCtx.drawImage(template, x - radius, y - radius)
    }

    ctx.z = shadowCanvasCtx.getImageData(0, 0, width, height).data
    console.timeEnd('z-renderer:process')
    return ctx
  }
}
