var gulp = require('gulp');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin');
var sourcemaps = require('gulp-sourcemaps');
var to5ify = require("6to5ify");
var nodemon = require("gulp-nodemon");
var sass = require('gulp-sass');


function sassTask() {
    return gulp.src('./public/styles/main.scss')
      .pipe(sass())
      .pipe(gulp.dest('./public/css'));
}
gulp.task('sass', sassTask);

function useminTask() {
  return gulp.src('./views/layouts/*.handlebars')
    .pipe(usemin({
      //css: [minifyCss(), 'concat'],
      //html: [minifyHtml({empty: true})],
      js: [uglify()]
    }))
    .pipe(gulp.dest('views/layouts/build/'));
  }

gulp.task('usemin', useminTask);


var getBundleName = function () {
  var version = require('./package.json').version;
  var name = require('./package.json').name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return version + '.' + name + '.' + 'min';
};

var bundler = watchify(browserify('./public/js/index.js', {
  debug: true,
}));
bundler.ignore(require.resolve('./lib/models/storage/model'));
bundler.ignore(require.resolve('./lib/models/storage/contact'));
bundler.ignore(require.resolve('./lib/models/storage/user'));
bundler.transform(to5ify);

function bundle() {
  return bundler.
    bundle()
    .pipe(source(getBundleName() + '.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      // Add transformation tasks to the pipeline here.
      //.pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js/dist/'));
}

gulp.task('scripts', bundle);
bundler.on('update', bundle);

gulp.task('dev', function () {
    nodemon({
        script: 'server.js',
        //nodeArgs: ['--harmony'],
        ext: 'js json scss handlebars',
        ignore: ["public/js/dist/*"],
    })
      .on('start', ['scripts', 'sass'])
      .on('restart', ['sass']); //let watchify handle scripts restarting
});


gulp.task('build', function() {
  sassTask().pipe(bundle()).pipe(useminTask());
});
