'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

//compile scss
gulp.task('sass', function() {
    return gulp.src('app/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/css'));
});

//compile and watch scss
gulp.task('sass:watch', function() {
    gulp.watch('app/scss/*.scss', gulp.series('sass'));
});