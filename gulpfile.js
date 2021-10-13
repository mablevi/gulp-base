const gulp = require('gulp'),
  browserify = require("browserify"),
  stream = require("vinyl-source-stream"),
  tsify = require("tsify"),
  uglify = require('gulp-uglify'),
  babel = require("gulp-babel"),
  buffer = require('vinyl-buffer'),
  cleanCSS = require('gulp-clean-css'),
  clean = require('gulp-clean');

const dir = 'dist'

gulp.task('script', () => {
  return browserify({
      basedir: '.',
      debug: true,
      entries: ['./src/js/main.ts'],
      cache: {},
      packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(stream('index.js'))
    .pipe(buffer())
    .pipe(babel({//编译ES6
        presets: ['es2015']
    }))
    .pipe(uglify({ mangle: { toplevel: true } }))
    .pipe(gulp.dest(`${dir}/js`))
})

gulp.task('css', () => {
  return gulp.src('src/css/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest(`${dir}/css`))
})

gulp.task('static', () => {
  return gulp.src('src/static/**/*')
    .pipe(gulp.dest(`${dir}/static`))
})

gulp.task('html', () => {
  return gulp.src('src/public/*.html')
    .pipe(gulp.dest(`${dir}/`))
})

gulp.task('clean', () => {
  return gulp.src(dir, { allowEmpty: true, readable: false })
    .pipe(clean())
})

gulp.task('build', gulp.series('clean', 'script', 'css', 'static', 'html'))