var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var bower = require('gulp-bower');
var inject = require('gulp-inject');

var mainBowerFiles = require('main-bower-files');

gulp.task("bower-files", function(){
    gulp.src(mainBowerFiles()).pipe(gulp.dest("./lib"));
});

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('lib/'))
});

gulp.task("webpack", function(callback) {
  // run webpack
  webpack({
    // configuration
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }]
    }
  }, function(err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    callback();
  });
});

gulp.task("webpack-dev-server", function(callback) {
  // Start a webpack-dev-server
  var compiler = webpack({
    // configuration
  });

  new WebpackDevServer(compiler, {
    // server and middleware options
  }).listen(8080, "localhost", function(err) {
    if (err) throw new gutil.PluginError("webpack-dev-server", err);
    // Server listening
    gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

    // keep the server alive or continue?
    // callback();
  });
});

gulp.task('inject', ['assets'], function() {
  return gulp.src('app/*.html')
    .pipe(inject(gulp.src('app/assets/**/*.*', {
      read: false
    }), {
      relative: true
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('index', function() {
  var target = gulp.src('./src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['./src/**/*.js', './src/**/*.css'], {
    read: false
  });

  return target.pipe(inject(sources))
    .pipe(gulp.dest('./src'));
});

gulp.task('default', ['index'], function() {
  // place code for your default task here

});
