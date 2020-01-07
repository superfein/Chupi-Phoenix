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
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

// Paths variable to make src/dist easier
const dev = './dev_theme';
const compiled = './compiled_theme'

const paths = {
  // Dev root
  dev: `${dev}`,
  // Dev HTML
  devHTMLDir: `${dev}/html`,
  devHTML: `${dev}/html/**/*.html`,
  devHTMLCSS: `${dev}/html/css`,
  devHTMLJS: `${dev}/html/js`,
  devHTMLImg: `${dev}/html/img`,
  // Dev assets
  devCSSDir: `${dev}/assets/css`,
  devSCSS: `${dev}/assets/css/**/*.scss`,
  devSCSSLiq: `${dev}/assets/css/*.scss.liquid`,
  devCSSLiq: `${dev}/assets/css/*.css.liquid`,
  devJS: `${dev}/assets/js/*.js`,
  devJSLiq: `${dev}/assets/js/*.js.liquid`,
  devImg: `${dev}/assets/img/**/*.{png,gif,jpg,svg}`, // include any of these image files types
  // Dev liquid
  devConfig: `${dev}/config/*`,
  devLayout: `${dev}/layout/*.liquid`,
  devLocales: `${dev}/locales/*`,
  devSections: `${dev}/sections/*.liquid`,
  devSnippets: `${dev}/snippets/*.liquid`,
  devTemplates: `${dev}/templates/**/*.liquid`,
  // Compiled root
  compiled: `${compiled}`,
  // Compiled Shopify directories
  compiledAssets: `${compiled}/assets`,
  compiledConfig: `${compiled}/config`,
  compiledLayout: `${compiled}/layout`,
  compiledLocales: `${compiled}/locales`,
  compiledSections: `${compiled}/sections`,
  compiledSnippets: `${compiled}/snippets`,
  compiledTemplates: `${compiled}/templates`
}

// Run browser-sync on HTML change
function pipeHTML() {
  return gulp.src(paths.devHTML)
    //.pipe(gulp.dest(paths.compiledHTML))
    .pipe(browserSync.stream());
}

// Pass Liquid Files to the right place, all ES6 Arrow Functions
const pipeConfig = () => gulp.src(paths.devConfig).pipe(gulp.dest(paths.compiledConfig));
const pipeLayout = () => gulp.src(paths.devLayout).pipe(gulp.dest(paths.compiledLayout));
const pipeSections = () => gulp.src(paths.devSections).pipe(gulp.dest(paths.compiledSections));
const pipeSnippets = () => gulp.src(paths.devSnippets).pipe(gulp.dest(paths.compiledSnippets));
const pipeTemplates = () => gulp.src(paths.devTemplates).pipe(gulp.dest(paths.compiledTemplates));


const images = () => {
  console.log('image processed');
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
    .pipe(gulp.dest(paths.devHTMLImg)) // pipe to current dev location for local testing
    .pipe(rename({dirname: ''})) // remove images parent directories for piping to compiled assets
    .pipe(gulp.dest(paths.compiledAssets)) // pipe to compiled assets
    .pipe(browserSync.stream())
  )
}

function scss(cb) {
  return (
    gulp
    .src(paths.devSCSS)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .on('error', sass.logError)
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    }))
    .pipe(t2.obj((chunk, enc, cb) => {
      let date = new Date();
      chunk.stat.atime = date;
      chunk.stat.mtime = date;
      cb(null, chunk);
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.devHTMLCSS)) // pipe to current dev location for local testing
    .pipe(gulp.dest(paths.compiledAssets)) // pipe to compiled assets
    .pipe(browserSync.stream())
    //cb();
  )
}

function scripts(cb) {
  return (
    gulp
    .src(paths.devJS)
    // Disabled to allow devTools debugger to work
    // .pipe(sourcemaps.init())
    // .pipe(babel({
    //   presets: ['@babel/env']
    // }))
    // .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.devHTMLJS)) // pipe to current dev location for local testing
    .pipe(gulp.dest(paths.compiledAssets)) // pipe to compiled assets
    .pipe(browserSync.stream())
    //cb();
  )
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
//gulp.task('compile', gulp.parallel(gulp.series(scss), gulp.series(scripts), gulp.parallel(pipeTemplates, pipeSections, pipeLayout, pipeSnippets, cssLiquid, jsLiquid), configFiles, localesFiles));

/* GLOBAL WATCH FUNCTION */
function watch() {

  browserSync.init({
    server: {
      baseDir: paths.devHTMLDir // point server to base HTML
    }//,
    // reloadDelay: 1000, // manual delay to allow for ThemeKit to sync
    // reloadOnRestart: false
  });

  gulp.watch(paths.devHTML, gulp.series(pipeHTML));
  gulp.watch(paths.devSCSS, gulp.series(scss));
  //gulp.watch(paths.devCSS, gulp.series(scss)).on('change', browserSync.reload);
  gulp.watch(paths.devJS, gulp.series(scripts, jsLiquid));
  gulp.watch(paths.devImg, gulp.series(images));
  gulp.watch(`${paths.dev}/**/*.liquid`, gulp.parallel(pipeTemplates, pipeSections, pipeLayout, pipeSnippets, cssLiquid, jsLiquid));
  //gulp.watch(`${paths.dev}/**/*.html`).on('change', browserSync.reload); // reload HTML
}
module.default = gulp.task('default', gulp.series(watch));
