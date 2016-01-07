var test = require('tap').test
var SRError = require('@semantic-release/error')

var condition = require('./')

test('raise errors in codeship environment', function (t) {
  t.test('only runs on codeship', function (tt) {
    tt.plan(2)

    condition({}, {env: {}}, function (err) {
      tt.ok(err instanceof SRError)
      tt.is(err.code, 'ENOCODESHIP')
    })
  })

  t.test('not running on pull requests', function (tt) {
    tt.plan(2)
    condition({}, {
      env: {
        CI_NAME: 'codeship',
        CI_PULL_REQUEST: 'true'
      }
    }, function (err) {
      tt.ok(err instanceof SRError)
      tt.is(err.code, 'EPULLREQUEST')
    })
  })

  t.test('only running on specified branch', function (tt) {
    tt.plan(5)

    condition({}, {
      env: {
        CI_NAME: 'codeship',
        CI_BRANCH: 'master'
      },
      options: {
        branch: 'master'
      }
    }, function (err) {
      tt.is(err, null)
    })

    condition({}, {
      env: {
        CI_NAME: 'codeship',
        CI_BRANCH: 'notmaster'
      },
      options: {
        branch: 'master'
      }
    }, function (err) {
      tt.ok(err instanceof SRError)
      tt.is(err.code, 'EBRANCHMISMATCH')
    })

    condition({}, {
      env: {
        CI_NAME: 'codeship',
        CI_BRANCH: 'master'
      },
      options: {
        branch: 'foo'
      }
    }, function (err) {
      tt.ok(err instanceof SRError)
      tt.is(err.code, 'EBRANCHMISMATCH')
    })
  })

  t.end()
})
