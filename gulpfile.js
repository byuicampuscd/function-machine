//Gulp general plugins
var gulp = require('gulp'),
   uglify = require('gulp-uglify'),
   livereload = require('gulp-livereload'),
   concat = require('gulp-concat'),
   cleanCSS = require('gulp-clean-css'),
   autoprefixer = require('gulp-autoprefixer'),
   plumber = require('gulp-plumber'),
   sourcemaps = require('gulp-sourcemaps'),
   babel = require('gulp-babel'),
   del = require('del');

//PATHS
var SCRIPTS_PATH = 'public/scripts/**/*.js',
   CSS_PATH = 'public/css/**/*.css',
   DIST_PATH = 'public/dist';

/*
DEVELOPMENT TASKS
*/
//Styles
gulp.task('styles', function () {
   return gulp.src(['public/css/reset.css', CSS_PATH])
      .pipe(plumber(function (err) {
         console.log("Styles Error " + err)
         this.emit('end');
      }))
      .pipe(sourcemaps.init())
      .pipe(autoprefixer())
      .pipe(concat('styles.css'))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(DIST_PATH))
      .pipe(livereload());
});

//Scripts
gulp.task('scripts', function () {
   return gulp.src(['public/scripts/main.js','public/scripts/plotGraph.js', 'public/scripts/ajax.js', SCRIPTS_PATH])
      .pipe(plumber(function (err) {
         console.log('Scripts Task Error ' + err);
         this.emit('end');
      }))
      .pipe(sourcemaps.init())
//      .pipe(babel({
//         presets: ['es2015']
//      }))
//      .pipe(uglify())
      .pipe(concat('scripts.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(DIST_PATH))
      .pipe(livereload());
});

/*
PRODUCTION TASKS WITH NO SOURCEMAPS
*/
//Styles
gulp.task('stylesPro', function () {
   return gulp.src(['public/css/reset.css', CSS_PATH])
      .pipe(plumber(function (err) {
         console.log("Styles Error " + err)
         this.emit('end');
      }))
      .pipe(autoprefixer())
      .pipe(concat('styles.css'))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest(DIST_PATH))
      .pipe(livereload());
});

//Scripts
gulp.task('scriptsPro', function () {
   return gulp.src(['public/scripts/main.js','public/scripts/plotGraph.js', 'public/scripts/ajax.js', SCRIPTS_PATH])
      .pipe(plumber(function (err) {
         console.log('Scripts Task Error ' + err);
         this.emit('end');
      }))
      .pipe(babel({
         presets: ['es2015']
      }))
      .pipe(uglify())
      .pipe(concat('scripts.js'))
      .pipe(gulp.dest(DIST_PATH))
      .pipe(livereload());
});

/*GENERAL TASKS*/
//clean task
gulp.task('clean', function () {
   return del.sync([
        DIST_PATH
    ]);
});

//Production task - no sourcemapping
gulp.task('product', ['clean', 'stylesPro', 'scriptsPro'], function () {
   console.log("production task.");
});

//default dev task
gulp.task('default', ['clean', 'styles', 'scripts'], function () {
   console.log("default task.");
});

//server task and live reload
gulp.task('watch', ['default'], function () {
   console.log("watch task.");
   require('./server.js');
   livereload.listen();
   gulp.watch(SCRIPTS_PATH, ['scripts']);
   gulp.watch(CSS_PATH, ['styles']);
})
