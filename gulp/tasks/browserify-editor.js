var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');

module.exports = function () {
    gulp.task('browserify-editor', function () {
        return browserify('./src/editor.js')
            .bundle()
            .pipe(source('level-editor.js'))
            .pipe(gulp.dest('./'));
    });
};
