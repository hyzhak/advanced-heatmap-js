//
// Place to add chai/mocha plugins
//

require('@babel/polyfill')

const chai = require('chai')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)
