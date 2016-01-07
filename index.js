var SRError = require('@semantic-release/error')

module.exports = function (pluginConfig, config, cb) {
  var env = config.env
  var options = config.options

  if (env.CI_NAME !== 'codeship') {
    return cb(new SRError(
      'semantic-release didn’t run on Codeship and therefore a new version won’t be published.\n' +
      'You can customize this behavior using "verifyConditions" plugins: git.io/sr-plugins',
      'ENOCODESHIP'
    ))
  }

  if (env.hasOwnProperty('CI_PULL_REQUEST') && env.CI_PULL_REQUEST !== 'false') {
    return cb(new SRError(
      'This test run was triggered by a pull request and therefore a new version won’t be published.',
      'EPULLREQUEST'
    ))
  }

  if (options.branch !== env.CI_BRANCH) {
    return cb(new SRError(
      'This test run was triggered on the branch ' + env.CI_BRANCH +
      ', while semantic-release is configured to only publish from ' +
      options.branch + '.\n' +
      'You can customize this behavior using the "branch" option: git.io/sr-options',
      'EBRANCHMISMATCH'
    ))
  }

  cb(null)
}
