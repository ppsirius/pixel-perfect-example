"use strict";

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    supportedBrowsers = "last 4 versions",
    plumber = require("gulp-plumber"),
    autoprefixer = require("autoprefixer"),
    gulpPostCss = require("gulp-postcss"),
    postcssDiscardDuplicates = require("postcss-discard-duplicates"),
    postcssDiscardEmpty = require("postcss-discard-empty"),
    postcssRoundSubpixels = require("postcss-round-subpixels"),
    postcssFlexbugsFixes = require("postcss-flexbugs-fixes"),
    postcssFocus = require("postcss-focus"),
    postcssZindex = require("postcss-zindex"),
    postcssVmin = require("postcss-vmin"),
    webpackStream = require('webpack-stream'),
    browsersync = require("browser-sync"),
    reload = browsersync.reload,
    // Paths
    src = 'src',
    dist = 'dist';

gulp.task("sass", function () {
    gulp.src(src + '/scss/*.scss')
        .pipe(plumber())
        .pipe(sass({
            "errLogToConsole": true
        }))
        .pipe(gulpPostCss([
            autoprefixer({
                "browsers": supportedBrowsers
            }),
            postcssDiscardDuplicates,
            postcssDiscardEmpty,
            postcssRoundSubpixels,
            postcssFlexbugsFixes,
            postcssFocus,
            postcssZindex,
            postcssVmin
        ]))
        .pipe(sourcemaps.write())
        .pipe(plumber.stop())
        .pipe(gulp.dest(dist + '/css'))
        .pipe(reload({
            "stream": true
        }));
});

gulp.task('webpack', function() {
    gulp.src('src/js/main.entry.js')
        .pipe(webpackStream( require('./webpack.config.js') ))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('copy-files', function () {
    gulp.src([src + '/**', '!src/scss{,/**}', '!src/js{,/**}'])
        .pipe(gulp.dest(dist));
});

gulp.task("watch", function () {
    gulp.watch(src + '/**', ['webpack', 'sass', 'copy-files']);
});

gulp.task("dev", ["watch"], function () {
    gulp.watch(dist + '/**').on("change", reload);
    browsersync({
        "server": dist
    });
});

