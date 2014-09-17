'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var jshintStylish = require('jshint-stylish');
var minifyCSS = require('gulp-minify-css');
var map = require('vinyl-map');
var template = require('gulp-template');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');


var templateSettings = {
    evaluate: /\/\*\:([\s\S]+?)\:\*\//g,
    interpolate: /\/\*\:=([\s\S]+?)\:\*\//g
};


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
    runSequence('lint', 'colorizr.js', 'colorizr.bundled.js', 'minify', done);
});

gulp.task('clean', function (done) {
    (require('rimraf'))('./dist', done);
});

gulp.task('lint', function () {

    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(jshintStylish))
        .pipe(jshint.reporter('fail'));

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
            templateData.css = contents.toString().trim().replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        }))
        .on('end', function () {

            gulp.src('src/colorizr.js')
                .pipe(template(templateData, templateSettings))
                .pipe(gulp.dest('dist/'))
                .on('end', done);

        });

});

gulp.task('colorizr.bundled.js', function (done) {

    var templateData = {
        spectrum: {}
    };

    gulp.src('bower_components/spectrum/spectrum.css')
        .pipe(minifyCSS({
            cache: false,
            keepSpecialComments: 0,
            keepBreaks: false,
            compatibility: 'ie7'
        }))
        .pipe(map(function (contents, filename) {
            templateData.spectrum.css = contents.toString().trim().replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        }))
        .on('end', function () {

            gulp.src([
                'bower_components/jquery/dist/jquery.js',
                'bower_components/spectrum/spectrum.js',
                'dist/colorizr.js'
            ])
                .pipe(map(function (contents, filename) {
                    if (path.basename(filename) === 'jquery.js') {
                        templateData.jQuery = contents.toString().trim();
                    } else if (path.basename(filename) === 'spectrum.js') {
                        templateData.spectrum.js = contents.toString().trim();
                    } else if (path.basename(filename) === 'colorizr.js') {
                        templateData.colorizr = contents.toString().trim();
                    }
                }))
                .on('end', function () {

                    gulp.src('src/colorizr.bundled.js')
                        .pipe(template(templateData, templateSettings))
                        .pipe(gulp.dest('dist/'))
                        .on('end', done);

                });

        });

});

gulp.task('minify', function () {

    return gulp.src('dist/*.js')
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest('dist'));

});
