const sass = require('gulp-sass')(require('sass'));
const compress_images = require("compress-images");
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pipeline = require('readable-stream').pipeline;
var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('sass', function () {
    return gulp.src('./src/assets/sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/assets/css'));
})
gulp.task('sass:watch', function () {
    gulp.watch('./src/assets/sass/**/*.scss', gulp.series('sass'));
});
gulp.task('postcss:prefix', function () {
    return gulp.src('./src/assets/css/*.css')
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest('./src/assets/css'));
});
gulp.task('postcss:min', function () {
    return gulp.src('./src/assets/css/*.css')
        .pipe(postcss([cssnano]))
        .pipe(gulp.dest('./dist/assets/css'));
});
gulp.task('posthtml', function () {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist'));

});
gulp.task('img:min', function () {
    compress_images(
        "src/assets/img/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}",
        "./dist/assets/img/",
        { compress_force: false, statistic: true, autoupdate: true },
        false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        {
            gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
        },
        function (err, completed) {
            if (completed === true) {
                // Doing something
            }
        }
    );
}
);
gulp.task('build',
    gulp.parallel('posthtml', 'img:min',
        gulp.series('postcss:prefix', 'postcss:min'))
);
gulp.task('scripts', function () {
    return gulp.src('./src/assets/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./src/assets/js'));
});
gulp.task('compress', function () {
    return pipeline(
        gulp.src('./src/assets/js/all.js'),
        uglify(''),
        gulp.dest('./dist/assets/js')
    );
});
// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./src/"
        }
    });
});