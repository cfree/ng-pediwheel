/**
 * Define extensions
 */
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	jsHint = require('gulp-jshint'),
	notify = require('gulp-notify'),
	source = require('vinyl-source-stream'),
	prefix = require('gulp-autoprefixer'),
	connect = require('gulp-connect'),
	sourcemaps = require('gulp-sourcemaps'),
	ngAnnotate = require('gulp-ng-annotate'),
	concat = require('gulp-concat'),

	files = {
		scss: ['public/assets/scss/*.scss', 'public/assets/scss/**/*.scss'],
		css: ['public/assets/css/*.css', 'public/assets/css/**/*.css'],
		js: ['public/js/*.js', 'public/js/**/*.js'],
		img: ['public/assets/img/*', 'public/assets/img/**/*'],
		app: ['app/*.js', 'app/**/*.js'],
		html: 'public/index.html',
		static: ['/index.html', 'public/assets/vendor/**/*.*', 'public/assets/css/**/*.css']
	},
	paths = {
		scss: 'public/assets/scss/',
		css: 'public/assets/css/',
		js: 'public/assets/js/',
		img: 'public/assets/img/',
		vendor: 'public/assets/vendor/',
		app: 'app/',
		public: 'public/'
	},
	dependencies = [
		'./node_modules/angular-ui-router/release/angular-ui-router.min.js',
		'./node_modules/angular/angular.min.js'
	];


/**
 * Development tasks
 */

gulp.task('js', ['lint'], function() {
	gulp.src(files.app)
		.pipe(sourcemaps.init())
			.pipe(concat('build.js'))
			.pipe(ngAnnotate())
				.on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.js))
		.pipe(connect.reload());;
});


// Lint scripts
gulp.task('lint', function() {
	gulp.src(files.app)
		.pipe(jsHint())
		.pipe(jsHint.reporter('default'))
			.on('error', notify.onError(function(file) {
				if (!file.jshint.success) {
					return 'JSHint failed. Check console for errors';
				}
			}));
});


// Compile Sass and refresh styles in browser
gulp.task('sass', function() {
	gulp.src(files.scss)
		.pipe(sass()
			.on('error', notify.onError({
				message: 'Sass failed. Check console for errors'
			}))
			.on('error', sass.logError))
		.pipe(prefix('last 1 version', '> 1%', 'ie >= 9'))
		.pipe(gulp.dest(paths.css))
		.pipe(connect.reload())
		.pipe(notify('Sass successfully compiled'));
});


// Install NPM dependencies
gulp.task('install', function() {
	gulp.src(dependencies)
		.pipe(gulp.dest(paths.vendor));
});


// Watch HTML file for changes
gulp.task('html', function () {
  gulp.src(files.html)
    .pipe(connect.reload());
});


// Serve
gulp.task('connect', function() {
	connect.server({
		root: 'public',
		livereload: true,
		port: 3001
	});
});


// Watch
gulp.task('watch', function() {
	gulp.watch(files.app, ['js']);
	gulp.watch(files.scss, ['sass']);
});


// Default
gulp.task('default', ['connect', 'watch']);



