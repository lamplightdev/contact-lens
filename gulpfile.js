var gulp = require('gulp');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
//var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var to5ify = require("6to5ify");
var nodemon = require("gulp-nodemon");
//var sass = require('gulp-sass');


var getBundleName = function () {
  var version = require('./package.json').version;
  var name = require('./package.json').name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return version + '.' + name + '.' + 'min';
};

/*
gulp.task('sass', function () {
  gulp.src('./public/sass/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/css'));
});
*/
gulp.task('scripts', function() {

  var bundler = browserify({
    entries: ['./public/js/index.js'],
    debug: true
  });

  bundler.transform(to5ify);

  var bundle = function () {
    return bundler.
      bundle()
      .pipe(source(getBundleName() + '.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        //.pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/js/dist/'));
  };

  return bundle();
});


gulp.task('dev', function () {
    nodemon({
        script: 'server.js',
        nodeArgs: ['--harmony'],
        ext: 'js json handlebars',
        ignore: ["public/js/dist/*"],
    })
      .on('start', ['scripts'])
      .on('restart', ['scripts']);
});
