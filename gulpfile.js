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

//Styles
gulp.task('styles', function () {
   console.log("styles task");
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
   console.log("scripts task");
   return gulp.src(['public/scripts/main.js', 'public/scripts/ajax.js', 'public/scripts/events.js', SCRIPTS_PATH])
      .pipe(plumber(function (err) {
         console.log('Scripts Task Error ' + err);
         this.emit('end');
      }))
      .pipe(sourcemaps.init())
      .pipe(babel({
         presets: ['es2015']
      }))
      .pipe(uglify())
      .pipe(concat('scripts.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(DIST_PATH))
      .pipe(livereload());
});

gulp.task('clean', function () {
   return del.sync([
        DIST_PATH
    ]);
});

//General tasks
gulp.task('default', ['clean', 'styles', 'scripts'], function () {
   console.log("default task.");
});

gulp.task('watch', ['default'], function () {
   console.log("watch task.");
   require('./server.js');
   livereload.listen();
   gulp.watch(SCRIPTS_PATH, ['scripts']);
   gulp.watch(CSS_PATH, ['styles']);
})
