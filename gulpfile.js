const gulp = require("gulp");
const { src, dest, series, parallel } = require("gulp");
const imagemin = require("gulp-imagemin");
const sourcemaps = require("gulp-sourcemaps");
// const concat = require("gulp-concat");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const terser = require("gulp-terser");
// const sass = require('gulp-sass');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const browsersync = require("browser-sync").create();
const watch = require("gulp-watch");
const tailwindcss = require("tailwindcss");
const i18n = require("gulp-html-i18n");

const paths = {
  html: {
    src: ["./src/**/*.html"],
    dest: "./dist/",
  },
  images: {
    src: ["./src/asset/images/**/*"],
    dest: "./dist/asset/images/",
  },
  fonts: {
    src: ["./src/asset/fonts/**/*"],
    dest: "./dist/asset/fonts/",
  },
  icons: {
    src: ["./src/asset/icons/**/*"],
    dest: "./dist/asset/icons/",
  },
  styles: {
    src: ["./src/css/**/*.css"],
    dest: "./dist/css/",
  },
  scripts: {
    src: ["./src/js/**/*.js"],
    dest: "./dist/js/",
  },
  cachebust: {
    src: ["./dist/**/*.html"],
    dest: "./dist/",
  },
};

function copyHtml() {
  return (
    src(paths.html.src)
      // .pipe(
      //   i18n({
      //     langDir: "./src/lang",
      //     createLangDirs: true,
      //     defaultLang: "es",
      //   })
      // )
      .pipe(dest(paths.html.dest))
  );
}

function copyFonts() {
  return src(paths.fonts.src).pipe(dest(paths.fonts.dest));
}

function copyIcons() {
  return src(paths.icons.src).pipe(dest(paths.icons.dest));
}

function optimizeImages() {
  return src(paths.images.src, { encoding: false })
    .pipe(imagemin().on("error", (error) => console.log(error)))
    .pipe(dest(paths.images.dest));
}

function compileStyles() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(
      postcss([tailwindcss("./tailwind.config.js"), autoprefixer(), cssnano()])
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.styles.dest));
}

function minifyScripts() {
  return src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(terser().on("error", (error) => console.log(error)))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.scripts.dest));
}

function cacheBust() {
  return src(paths.cachebust.src)
    .pipe(replace(/cache_bust=\d+/g, "cache_bust=" + new Date().getTime()))
    .pipe(dest(paths.cachebust.dest));
}

function browserSyncServer(cb) {
  browsersync.init({
    server: {
      baseDir: "./dist",
      index: "/index.html",
    },
  });
  cb();
}

function browserReload(cb) {
  browsersync.reload();
  cb();
}

function watchHtml() {
  watch(
    paths.html.src,
    series(copyHtml, compileStyles, cacheBust, browserReload)
  );
}

function watchImages() {
  watch(paths.images.src, optimizeImages);
}

function watchStyles() {
  watch(paths.styles.src, series(compileStyles, cacheBust, browserReload));
}

function watchScripts() {
  watch(paths.scripts.src, series(minifyScripts, cacheBust, browserReload));
}

// function watcher() {
//   parallel(watchHtml, watchImages, watchStyles, watchScripts);
// }

exports.copyHtml = copyHtml;
exports.copyFonts = copyFonts;
exports.copyIcons = copyIcons;
exports.optimizeImages = optimizeImages;
exports.compileStyles = compileStyles;
//exports.minifyScripts = minifyScripts;
exports.cacheBust = cacheBust;
exports.browserReload = browserReload;
exports.browserSyncServer = browserSyncServer;
exports.watchHtml = watchHtml;
exports.watchImages = watchImages;
exports.watchStyles = watchStyles;
exports.watchScripts = watchScripts;

exports.watcher = series(
  parallel(
    copyHtml,
    copyFonts,
    copyIcons,
    optimizeImages,
    compileStyles
    //minifyScripts
  ),
  cacheBust,
  browserSyncServer,
  parallel(watchHtml, watchImages, watchStyles, watchScripts)
);

exports.default = exports.watcher;
