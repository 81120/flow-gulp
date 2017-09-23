const gulp = require('gulp')
const {removeFlowTypes} = require('./util/remove-flow-types.js')

gulp.task('build', () => {
  gulp.src(['src/*'])
      .pipe(removeFlowTypes({pretty: true}))
      .pipe(gulp.dest('dist/src'))
})