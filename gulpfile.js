// ------------------------------------------------------------------------------------------------------------------ //
//          DEV TASKS MANAGER
// ------------------------------------------------------------------------------------------------------------------ //
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const concat = require('gulp-concat');
const swig = require('gulp-swig');
const del = require('del');

gulp.task('default', function (done) {

	// Data used in html files
	let swigData = {
		path_img: 'img/'	// path to output images folder to be used in the static website
	};

	return del(['public/']).then(function () { // delete the public/ folder

		return [

			// Compile HTML files
			gulp.src([
				'src/*.html'
			]).pipe(swig({ data: swigData }))
				.pipe(gulp.dest('public/')),

			// Compile CSS files
			gulp.src('src/scss/main.scss')
				.pipe(sass())
				.pipe(autoprefixer())
				.pipe(csso())
				.pipe(gulp.dest('public/')),

			// Compile JS files
			gulp.src([
				'src/js/*.js'
			]).pipe(concat('main.js'))
				.pipe(gulp.dest('public/')),

			// Compile vendor JS files
			gulp.src([
				'node_modules/jquery/dist/jquery.min.js'
			]).pipe(concat('vendor.js'))
				.pipe(gulp.dest('public/')),

			// Compile vendor CSS files
			gulp.src([
				'node_modules/flexboxgrid/dist/flexboxgrid.css'
			]).pipe(concat('vendor.css'))
				.pipe(gulp.dest('public/')),

			// Copy others files
			gulp.src([
				'src/img/*'
			]).pipe(gulp.dest('public/img/')),
		];

	});

	done();
});