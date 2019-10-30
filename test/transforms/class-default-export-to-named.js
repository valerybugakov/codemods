import jscodeshift from 'jscodeshift'
import fs from 'fs'
import path from 'path'
import assert from 'assert'

import namedExportsTransform from '../../transforms/named-export-generation'

// TODO: update tests
describe('Named exports generation transform', function() {
  // it('should generate named exports for an exported declarator', helper.bind(this, 'declared'))
  // it(
  //   'should generate named exports for an exported declarator that has been mutated',
  //   helper.bind(this, 'declared-mutated')
  // )
  // it(
  //   'should generate named exports for an exported object expression',
  //   helper.bind(this, 'expression')
  // )
  // it('should generate named exports if object keys are references', helper.bind(this, 'references'))
  // it(
  //   'should ignore computed property keys for an exported object expression',
  //   helper.bind(this, 'ignore')
  // )
})

function helper(name) {
  var src = fs
    .readFileSync(
      path.resolve(__dirname, '../fixtures/named-export-generation/' + name + '.before.js')
    )
    .toString()
  var expectedSrc = fs
    .readFileSync(
      path.resolve(__dirname, '../fixtures/named-export-generation/' + name + '.after.js')
    )
    .toString()
  var result = namedExportsTransform({ source: src }, { jscodeshift: jscodeshift })
  assert.equal(result, expectedSrc)
}
