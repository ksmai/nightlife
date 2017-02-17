const gulp = require('gulp');
const eslint = require('gulp-eslint');
const paths = require('./gulp.config.json');
const jasmine = require('gulp-jasmine');

gulp.task('lint-server', function() {
  return gulp.
    src(paths.serverJs).
    pipe(eslint()).
    pipe(eslint.format()).
    pipe(eslint.failAfterError());
});

gulp.task('test-server', ['lint-server'], function() {
  return gulp.
    src(paths.serverSpecs).
    pipe(jasmine());
});

gulp.task('lint', ['lint-server']);
gulp.task('test', ['test-server']);
