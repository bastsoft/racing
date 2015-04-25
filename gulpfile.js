var gulp = require('./gulp')([
    'browserify-app',
    'browserify-editor',
    'compress'
]);

var connect = require('gulp-connect');

gulp.task('webserver', function () {
    connect.server({
        root: '.',
        host: 'localhost',
        port: '13000',
        livereload: false
    });
});

gulp.task('reload', function () {
    connect.reload();
});

gulp.task('build', ['browserify-app', 'browserify-editor', 'reload']);
gulp.task('default', ['build', 'webserver']);
