"use strict";

require("babel-register")({
	presets: ["es2015"]
});

const gulp = require("gulp");
const jshint = require("gulp-jshint");
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const jasmine = require("gulp-jasmine");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const babelify = require("babelify");

const JS_SRC_PATH = "./src/js/";
const DIST_DIR = "./dist";
const DIST_JS_PATH = DIST_DIR + "/js";

gulp.task("clean", () => {
	return del([DIST_DIR]);
});

gulp.task("jshint", () => {
	return gulp.src(JS_SRC_PATH + "**/*.js")
		.pipe(jshint())
		.pipe(jshint.reporter("default"))
		.pipe(jshint.reporter("fail"));
});

gulp.task("js2", ["clean", "jshint", "jasmine"], () => {
	let bundler = browserify(JS_SRC_PATH).transform(babelify, {presets: ["es2015"]});

	return bundler.bundle()
		.on('error', function(err) { console.error(err.message); this.emit('end'); })
		.pipe(source("bundle.js"))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write("../maps"))
		.pipe(gulp.dest(DIST_JS_PATH));
});

gulp.task("jasmine", ["jshint"], () => {
	return gulp.src("./test/**/*.js")
		.pipe(jasmine({verbose: true}));
});

gulp.task("default", ["clean", "js2"]);