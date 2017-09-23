const through = require('through2')
const gulpUtil = require('gulp-util')
const flowRemoveTypes = require('flow-remove-types')

const removeFlowTypes = (options) => through.obj(function(file, encode, callback) {
  if (file.isNull()) {
    this.push(file)
    return callback()
  }
  if (file.isStream()) {
    this.emit('error', new gulpUtil.PluginError(PLUGIN_NAME, 'steam is not supported'))
    this.push(file)
    return callback()
  }
  const fileContent = file.contents.toString()
  file.contents = new Buffer(flowRemoveTypes(fileContent, options).toString())
  this.push(file)
  callback()
})

module.exports = {removeFlowTypes}
