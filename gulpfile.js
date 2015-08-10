var gulp = require('gulp');
var babel = require('gulp-babel');
var react = require('gulp-react');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');

gulp.task('build-js', function () {
    return gulp.src('./src/EasyDay.js')
        .pipe(babel())
        .pipe(react())
        .pipe(gulp.dest('./lib'))
        .pipe(uglify())
        .pipe(rename('easy-day.js'))
        .pipe(gulp.dest('./dist'))
});

gulp.task('build-sass', function () {
    return gulp.src('./scss/EasyDay.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(rename('default.css'))
        .pipe(gulp.dest('./dist'))
});

gulp.task('build-example', function(){
    return gulp.src('./examples/src/example.js')
        .pipe(babel())
        .pipe(browserify())
        .pipe(react())
        .pipe(gulp.dest('./examples/build'))
});

gulp.task('default', ['build-js', 'build-sass', 'build-example']);