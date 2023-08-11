const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const exec = require('child_process').exec;

const stylesPath = './src/styles/sass/**/*.scss';

function compileSass() {
    return gulp.src(stylesPath)
    .pipe(sourcemaps.init())
    .pipe(concat('style.scss'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/dist'));
}

gulp.task('styles', () => compileSass());
gulp.task('watch', () => gulp.watch(stylesPath, compileSass));
gulp.task('start', () => exec('npx react-scripts start', {}));

gulp.task('default', gulp.parallel('start', 'watch'));

gulp.task('prod', gulp.series('styles'));