var gulp = require('gulp');
var responsive = require('gulp-responsive');
var browserSync = require('browser-sync').create();
var del = require('del');


// Clean
gulp.task('clean', function() {
  return del(['dist']);
});

// Copy files to dist folder
// Will need to minify js and css if files get big
gulp.task('copyfiles', function() {
  gulp.src('./src/css/**/*.css')
    .pipe(gulp.dest('./dist/css'));
  gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist'));
  gulp.src('./src/images/*.svg')
    .pipe(gulp.dest('./dist/images'));
});

// Optimize Images
gulp.task('responsive-images', function() {
  gulp.src('./src/images/*.jpg')
    .pipe(responsive(
      {
        '*.jpg': [{
            width: 480,
            rename: { suffix: '-small' }
          }, {
            width: 640,
            rename: { suffix: '-medium' }
          }, {
            width: 800,
            rename: { suffix: '-large_1x' }
          }, {
            width: 1600,
            rename: { suffix: '-large_2x' }
        }]
      }, {
        quality: 70,
        progressive: true,
        withMetadata: false,
      }))
    .pipe(gulp.dest('dist/images'));
});

// Watch Task
gulp.task('watch', ['browser-sync'], function (){
  gulp.watch(['src/index.html', 'src/css/*.css'], ['copyfiles']);
  gulp.watch('src/images/*.svg', ['copyfiles']);
  gulp.watch('src/images/*.jpg', ['responsive-images']); 
});

gulp.task('browser-sync', ['default'], function () {
  var files = [
    'src/index.html',
    'src/css/*.css',
    'src/images/*.jpg',
    'src/images/*svg',
    'dist/**/*'
  ];

  browserSync.init(files, {
    server: {
      baseDir: "dist",
      index: "index.html"
    }
  });  

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', browserSync.reload);
    
});

// Default Task
gulp.task('default', ['clean'], function() {
  gulp.start('copyfiles', 'responsive-images');
});