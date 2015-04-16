var gulp = require('./gulp')([
    'browserify',
    'webserver',
    'openbrowser',
    'compress'
]);

gulp.task('build', ['browserify']);
gulp.task('default', ['build', 'webserver', 'openbrowser']);
