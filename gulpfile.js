//Gulp general plugins
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    del = require('del'),
    zip = require('gulp-zip');

//PATHS
var SCRIPTS_PATH = 'public/scripts/**/*.js',
    CSS_PATH = 'public/css/**/*.css',
    DIST_PATH = 'public/dist',
    SCSS_PATH = 'public/scss/**/*.scss',
    TEMPLATES_PATH = 'templates/**/*.hbs',
    IMAGES_PATH = 'public/images/**/*.{png,jpeg,jpg,gif,svg}';

//Handlebar plugins
var handlebars = require('gulp-handlebars'),
    handlebarsLib = require('handlebars'),
    declare = require('gulp-declare'),
    wrap = require('gulp-wrap');

//image optimization
var jpegoptim = require('imagemin-jpegoptim'),
    pngquant = require('imagemin-pngquant'),
    optipng = require('imagemin-optipng'),
    size = require('gulp-size');


//Styles
//gulp.task('styles', function () {
//    console.log("styles task");
//    return gulp.src(['public/css/reset.css', CSS_PATH])
//        .pipe(plumber(function (err) {
//            console.log("Styles Error " + err)
//            this.emit('end');
//        }))
//        .pipe(sourcemaps.init())
//        .pipe(autoprefixer())
//        .pipe(concat('styles.css'))
//        .pipe(minifyCSS())
//        .pipe(sourcemaps.write())
//        .pipe(gulp.dest(DIST_PATH))
//        .pipe(livereload());
//});

//styles for scss
gulp.task('styles', function () {
    console.log("styles task");
    return gulp.src('public/scss/styles.scss')
        .pipe(plumber(function (err) {
            console.log("Styles Error " + err)
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

//Scripts
gulp.task('scripts', function () {
    console.log("scripts task");
    return gulp.src(SCRIPTS_PATH)
        .pipe(plumber(function (err) {
            console.log('Scripts Task Error ' + err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015', 'react']
        }))
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

//Images
gulp.task('images', function () {
    console.log("images task");

//    return gulp.src(IMAGES_PATH)
//        .pipe(size({
//            title: "Uncompressed images"
//        }))
//        .pipe(pngquant({
//            quality: '65-80',
//            speed: 4
//        })())
//        .pipe(optipng({
//            optimizationLevel: 3
//        })())
//        .pipe(jpegoptim({
//            max: 70
//        })())
//        .pipe(size({
//            title: "compressed images"
//        }))
//        .pipe(gulp.dest(DIST_PATH + '/images'))
});

//Templates
gulp.task('templates', function () {
    return gulp.src(TEMPLATES_PATH)
        .pipe(handlebars({
            handlebars: handlebarsLib
        }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'handlebars',
            noRedeclare: true
        }))
        .pipe(concat('handlebars.js'))
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

gulp.task('clean', function() {
    return del.sync([
        DIST_PATH
    ]);
});

gulp.task('export', ['default'], function() {
    return gulp.src('public/**/*')
        .pipe(zip('website.zip'))
        .pipe(gulp.dest('./'))
})

//General tasks
gulp.task('default', ['clean', 'images', 'templates', 'styles', 'scripts'], function () {
    console.log("default task.");
});

gulp.task('watch', ['default'], function () {
    console.log("watch task.");
    require('./server.js');
    livereload.listen();
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    gulp.watch(SCSS_PATH, ['styles']);
    gulp.watch(TEMPLATES_PATH, ['templates']);
    //    gulp.watch(CSS_PATH, ['styles']);
})
