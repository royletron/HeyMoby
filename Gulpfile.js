var gulp = require('gulp');

gulp.task('express', function(){
  var app = require('./app');
})

var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(4002);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('watch', function(){
  gulp.watch('**/*.jade', notifyLiveReload);
  gulp.watch('**/*.css', notifyLiveReload);
})

gulp.task('default', ['express', 'livereload', 'watch'], function(){

})
