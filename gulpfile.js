var gulp = require('gulp')
var nodemon = require('gulp-nodemon')

gulp.task('dev', function () {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    }
  })
})

gulp.task('prod', function () {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: {
      'NODE_ENV': 'production'
    }
  })
})
