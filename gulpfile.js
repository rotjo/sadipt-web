var gulp            = require('gulp');
var runSequence     = require('run-sequence');
var sass            = require('gulp-sass');
var rename          = require('gulp-rename');
var htmlprocessor   = require('gulp-htmlprocessor');
var sourcemaps      = require('gulp-sourcemaps');
var postcss         = require('gulp-postcss');
var flatten         = require('gulp-flatten'); //Mueve archivos
var jshint          = require('gulp-jshint');
var scsslint        = require('gulp-scss-lint');
var stylish         = require('jshint-stylish');
var imagemin        = require('gulp-imagemin');
var uglify          = require('gulp-uglify');
var htmlmin         = require('gulp-htmlmin');
var browserSync     = require('browser-sync').create();
var autoprefixer    = require('autoprefixer');
var concat          = require('gulp-concat');
var cssnano         = require('gulp-cssnano');
var ghPages         = require('gulp-gh-pages');

gulp.task('browserSync', ['build'], function() {
  browserSync.init({
    port: 3000,
    server: {
      baseDir: './dist'
    }
  })
});

gulp.task('scss-lint', function() {
  return gulp.src('./src/styles/*.scss')
  .pipe(scsslint());
});

gulp.task('sass', function () {
  return gulp.src('./src/styles/style.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({ outputStyle: 'expanded' }))
  .pipe(postcss([
      autoprefixer({'browsers': ['last 5 versions', '> 1%']}),
  ]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./dist/styles'));
});

gulp.task('minifyCSS', function () {
  return gulp.src(['./dist/styles/*.css', '!./dist/styles/*.min.css'])
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('./dist/styles'));
});

gulp.task('css', function (done) {
  runSequence(
    'scss-lint',
    'sass',
    'minifyCSS'
    , done);
});

gulp.task('minifyJS', function () {
  return gulp.src('./src/scripts/main.js')
  .pipe(sourcemaps.init())
  .pipe(uglify({mangle: false}))
  .pipe(rename({suffix: '.min'}))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('concatJS', function () {
  return gulp.src(['./src/scripts/*.js', '!./src/scripts/main.js'])
  .pipe(concat('main.js'))
  .pipe(gulp.dest('./src/scripts'));
});

gulp.task('lintJS', function() {
  return gulp.src(['./src/scripts/*.js', '!./src/scripts/main.js'])
  .pipe(jshint())
  .pipe(jshint.reporter(stylish))
  .pipe(jshint.reporter('fail'));
});

gulp.task('js', function (done) {
  runSequence(
    'lintJS',
    'concatJS',
    'minifyJS'
    , done);
});

gulp.task('images', function() {
  return gulp.src('./src/img/*.{svg,png,jpg}')
  .pipe(imagemin({
    verbose: true
  }))
  .pipe(gulp.dest('./dist/img/'));
});

gulp.task('html', function () {
  return gulp.src('./src/views/*.html')
  .pipe(htmlprocessor())
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('./dist'));
});

gulp.task('ghPages', function () {
  return gulp.src('./dist/**/*')
  .pipe(ghPages());
});

gulp.task('serve', ['browserSync']);

gulp.task('build', ['css', 'js', 'html']);

gulp.task('deploy', function (done) {
  runSequence(
    'build',
    'ghPages'
    , done);
});

gulp.watch('./src/views/*.html', ['html']);
gulp.watch('./src/styles/*.scss', ['css']);
gulp.watch('./src/scripts/*.js', ['js']);
