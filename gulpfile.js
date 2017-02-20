const gulp = require('gulp');
const eslint = require('gulp-eslint');
const paths = require('./gulp.config.json');
const jasmine = require('gulp-jasmine');
const minifyHTML = require('gulp-minify-html');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');
const babel = require('gulp-babel');

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

gulp.task('lint-client', function() {
  return gulp.
    src(paths.clientJs).
    pipe(eslint()).
    pipe(eslint.format()).
    pipe(eslint.failAfterError());
});

gulp.task('minhtml', function() {
  return gulp.
    src(paths.clientHtml).
    pipe(minifyHTML({
      empty: true
    })).
    pipe(gulp.dest(paths.bin));
});

gulp.task('mincss', function() {
  return gulp.
    src(paths.clientCss).
    pipe(concat('styles.min.css')).
    pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    })).
    pipe(cleanCSS()).
    pipe(gulp.dest(paths.bin));
});

gulp.task('minjs', ['lint-client'], function() {
  return gulp.
    src(paths.clientAppJs).
    pipe(concat('app.min.js')).
    pipe(babel({
      presets: ['es2015']
    })).
    pipe(uglify()).
    pipe(gulp.dest(paths.bin));
});

gulp.task('minvendor', function() {
  return gulp.
    src(paths.vendorJs).
    pipe(concat('vendors.min.js')).
    pipe(gulp.dest(paths.bin));
});

gulp.task('clean', function(cb) {
  del([paths.bin], cb);
});

gulp.task('build', ['minhtml', 'mincss', 'minjs', 'minvendor']);
gulp.task('lint', ['lint-server', 'lint-client']);
gulp.task('test', ['test-server']);

gulp.task('watch', ['build'], function() {
  gulp.watch(paths.clientHtml, ['minhtml']);
  gulp.watch(paths.clientCss, ['mincss']);
  gulp.watch(paths.clientAppJs, ['minjs']);

  console.log(`Watching on PID ${process.pid}`);
});
