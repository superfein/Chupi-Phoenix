// Requires
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const t2 = require('through2');

// Paths variable to make src/dist easier
const dev = './dev_theme';
const compiled = './compiled_theme'

const paths = {
  dev: `${dev}`,
  devImg: `${dev}/assets/img/*`,
  devCSS: `${dev}/assets/css/*.scss`,
  devSCSSLiq: `${dev}/assets/css/*.scss.liquid`,
  devCSSLiq: `${dev}/assets/css/*.css.liquid`,
  devJS: `${dev}/assets/js/*.js`,
  devJSLiq: `${dev}/assets/js/*.js.liquid`,
  devConfig: `${dev}/config/*`,
  devLayout: `${dev}/layout/*.liquid`,
  devLocales: `${dev}/locales/*`,
  devSections: `${dev}/sections/*.liquid`,
  devSnippets: `${dev}/snippets/*.liquid`,
  devTemplates: `${dev}/templates/**/*.liquid`,
  compiled: `${compiled}`,
  compiledAssets: `${compiled}/assets`,
  compiledConfig: `${compiled}/config`,
  compiledLayout: `${compiled}/layout`,
  compiledLocales: `${compiled}/locales`,
  compiledSections: `${compiled}/sections`,
  compiledSnippets: `${compiled}/snippets`,
  compiledTemplates: `${compiled}/templates`
}

// Pass Liquid Files to the right place, all ES6 Arrow Functions
const pipeConfig = () => gulp.src(paths.devConfig).pipe(gulp.dest(paths.compiledConfig));
const pipeLayout = () => gulp.src(paths.devLayout).pipe(gulp.dest(paths.compiledLayout));
const pipeSections = () => gulp.src(paths.devSections).pipe(gulp.dest(paths.compiledSections));
const pipeSnippets = () => gulp.src(paths.devSnippets).pipe(gulp.dest(paths.compiledSnippets));
const pipeTemplates = () => gulp.src(paths.devTemplates).pipe(gulp.dest(paths.compiledTemplates));

const images = () => {
  return (
    gulp
    .src(paths.devImg)
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imageminMozjpeg({
        quality: 70
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest(paths.assets))
  )
}


function scss(cb) {
  gulp
    .src(paths.devCSS)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'nested'
    }))
    .on('error', sass.logError)
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 5 versions'],
      grid: true
    }))
    .pipe(t2.obj((chunk, enc, cb) => {
      let date = new Date();
      chunk.stat.atime = date;
      chunk.stat.mtime = date;
      cb(null, chunk);
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.compiledAssets))
    cb();
}

function scripts(cb) {
  return (
    gulp
    .src(paths.devJS)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.compiledAssets)))
    cb();
}

function cssLiquid(cb) {
  gulp.src([paths.devCSSLiq, paths.devSCSSLiq])
  .pipe(gulp.dest(paths.compiledAssets))
  cb();
}

function jsLiquid(cb) {
  gulp.src(paths.devJSLiq)
  .pipe(gulp.dest(paths.compiledAssets))
  cb();
}

function configFiles(cb) {
  gulp.src(paths.devConfig)
  .pipe(gulp.dest(paths.compiledConfig))
  cb();
}
function localesFiles(cb) {
  gulp.src(paths.devLocales)
  .pipe(gulp.dest(paths.compiledLocales))
  cb();
}

/* This function runs everything and pipes to compiled */
gulp.task('compile', gulp.parallel(gulp.series(scss), gulp.series(scripts, jsLiquid), gulp.parallel(pipeTemplates, pipeSections, pipeLayout, pipeSnippets, cssLiquid, jsLiquid), configFiles, localesFiles))

/* GLOBAL WATCH FUNCTION */
function watch() {
  gulp.watch(paths.devCSS, gulp.series(scss))
  gulp.watch(paths.devJS, gulp.series(scripts, jsLiquid));
  gulp.watch(`${paths.dev}/**/*.liquid`, gulp.parallel(pipeTemplates, pipeSections, pipeLayout, pipeSnippets, cssLiquid, jsLiquid));
}
module.default = gulp.task('default', gulp.series(watch));
