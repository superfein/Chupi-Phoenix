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
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const shopifyTheme = require('gulp-shopify-theme').create();
// const shopifyConfig = {
//     "api_key": "4ed281a204f9483711845dd6638b7462",
//     "password": "7824e7664f151de22f271097823e5321",
//     "shared_secret": "a43cbbd22625e6bf52f5701b3a65a091",
//     "shop_name": "phoenix-chupi.myshopify.com",
//     "theme_id": "38201524258"
// }

// Paths variable to make src/dist easier
const dev = './dev_theme';
const compiled = './compiled_theme'

const paths = {
  dev: `${dev}`,
  devImg: `${dev}/assets/img/*.{png,gif,jpg,svg}`,
  devCSSPartials: `${dev}/assets/css/partials/**/*.scss`,
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
    .pipe(gulp.dest(paths.compiledAssets))
  )
}

function scss(cb) {
  gulp
    .src(paths.devCSS)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
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
    //.pipe(shopifyTheme.stream())
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

// Shopify stream css
function shopifyThemeInit() {
  // gulp.src(paths.compiledAssets)
  // .pipe( shopifyTheme.stream( {theme_id: 38201524258} ) )
  // console.log('SHOPIFY THEME UPDATED');
}

// gulp.task( 'shopify-theme-init', function () {
//     shopifyTheme.init(shopifyConfig);
// });


/* This function runs everything and pipes to compiled */
gulp.task('compile', gulp.parallel(gulp.series(scss), gulp.series(scripts), gulp.parallel(pipeTemplates, pipeSections, pipeLayout, pipeSnippets, cssLiquid, jsLiquid), configFiles, localesFiles));

/* GLOBAL WATCH FUNCTION */
function watch() {

  browserSync.init({
    open: 'external',
    proxy: 'https://phoenix-chupi.myshopify.com/',
    port: 8080,
    reloadDelay: 2000, // manual delay to allow for ThemeKit to sync
    reloadOnRestart: false
  });

  gulp.watch(paths.devCSSPartials, gulp.series(scss)).on('change', browserSync.reload);
  gulp.watch(paths.devCSS, gulp.series(scss)).on('change', browserSync.reload);
  gulp.watch(paths.devJS, gulp.series(scripts, jsLiquid)).on('change', browserSync.reload);
  gulp.watch(paths.devImg, gulp.series(images)).on('change', browserSync.reload);
  gulp.watch(`${paths.dev}/**/*.liquid`, gulp.parallel(pipeTemplates, pipeSections, pipeLayout, pipeSnippets, cssLiquid, jsLiquid)).on('change', browserSync.reload);
}
module.default = gulp.task('default', gulp.series(watch));
