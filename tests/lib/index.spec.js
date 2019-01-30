import { expect } from 'chai'

import HeatMap from '../../'

describe('heatmap', () => {
  it('should construct', () => {
    expect(new HeatMap()).to.be.defined
  })
})
