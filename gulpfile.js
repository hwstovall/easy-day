var gulp = require('gulp');
var babel = require('gulp-babel');
var react = require('gulp-react');

gulp.task('default', function(){
    return gulp.src('./src/EasyDay.js')
        .pipe(babel())
        .pipe(react())
        .pipe(gulp.dest('./lib'))
});