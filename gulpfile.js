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
const concat = require("gulp-concat");
const less = require("gulp-less");

const JS_SRC_PATH = "./src/js/";
const STYLES_SRC_PATH = "./src/less/";
const DIST_DIR = "./dist";
const DIST_JS_PATH = DIST_DIR + "/js";
const DIST_STYLES_PATH = DIST_DIR + "/css";

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
		.on('error', function(err) { console.error(err.message); this.end(); })
		.pipe(source("bundle.js"))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write("../maps/js"))
		.pipe(gulp.dest(DIST_JS_PATH));
});

gulp.task("jasmine", ["jshint"], () => {
	return gulp.src("./test/**/*.js")
		.pipe(jasmine({verbose: true}));
});

gulp.task("less", ["clean"], () => {
	return gulp.src(STYLES_SRC_PATH + "**/*.less")
		.pipe(sourcemaps.init())
		.pipe(less())
		.on('error', function(err) { console.error(err.message); this.end(); })
		.pipe(sourcemaps.write("../maps/css"))
		.pipe(gulp.dest(DIST_STYLES_PATH));
});

gulp.task("default", ["clean", "js2", "less"]);