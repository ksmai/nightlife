const gulp = require('gulp');
const eslint = require('gulp-eslint');
const paths = require('./gulp.config.json');

gulp.task('lint-server', function() {
  return gulp.
    src(paths.serverJS).
    pipe(eslint()).
    pipe(eslint.format()).
    pipe(eslint.failAfterError());
});

gulp.task('lint', ['lint-server']);
