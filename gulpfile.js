'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var minifyCSS = require('gulp-minify-css');
var map = require('vinyl-map');
var template = require('gulp-template');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');


gulp.task('dev', ['watch', 'build']);

gulp.task('watch', function () {

    gulp.watch([
        'src/**/*',
        '.jshintrc'
    ], [
        'build'
    ]);

});

gulp.task('build', ['clean'], function (done) {
    runSequence('lint', 'colorizr.js', 'minify', done);
});

gulp.task('clean', function (done) {
    (require('rimraf'))('./dist', done);
});

gulp.task('lint', function () {
    console.log('TODO: Linting');
});

gulp.task('colorizr.js', function (done) {

    var templateData = {};

    gulp.src('src/colorizr.css')
        .pipe(minifyCSS({
            cache: false,
            keepSpecialComments: 0,
            keepBreaks: false,
            compatibility: 'ie7'
        }))
        .pipe(map(function (contents, filename) {
            templateData.css = contents.toString().trim();
        }))
        .on('end', function () {

            gulp.src('src/colorizr.js')
                .pipe(template(templateData))
                .pipe(gulp.dest('dist/'))
                .on('end', done);

        });

});

gulp.task('minify', function () {

    return gulp.src('dist/*.js')
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest('dist'));

});
