## Building a gulp environment for Flow

[Flow](https://flow.org/en/)是一个Javascript的静态类型检查工具。对于一般的Javascript代码，可以用Flow来对代码进行静态类型推导，发现潜在的Bug。不仅如此，Flow也提供了一套为在Javascript中声明静态类型的语法，以及一个将带有Flow风格类型声明的Javascript代码转换成正常的Javascript代码的工具。

听起来很好玩，那么就要想办法把它集成到日常的开发工作流中，首先想到的就是gulp，将Flow的这个能力作为一个gulp插件就很容易将它集成到日常的开发工作流中。

查了一下资料，也非常简单，开源社区已经存在了两个很稳定的工具可以将Flow风格的Javascript代码转换成正常风格的Javascript代码。分别是`babel-preset-flow`和`flow-remove-types`，前者看命名就可以看出来是一个`babel`的loader，而后者是一个Javascript版本的转换API，为了在gulp中集成，果断选后者。下面就是写一个简单的gulp插件就好了。
废话少说，直接看代码：

```javascript
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
```

在`gulpfile.js`中直接使用就好：
```javascript
const gulp = require('gulp')
const {removeFlowTypes} = require('./util/remove-flow-types.js')

gulp.task('build', () => {
  gulp.src(['src/*'])
      .pipe(removeFlowTypes({pretty: true}))
      .pipe(gulp.dest('dist/src'))
})
```

测试：
在`src/index.js`中为：
```javascript
/**@flow */
const f = (x : ?number) : number => x ? x : 0

module.exports = {f}
```

执行`gulp build`后，生成`dist/src/index.js`：
```javascript
/** */
const f = (x) => x ? x : 0

module.exports = {f}
```
搞定。