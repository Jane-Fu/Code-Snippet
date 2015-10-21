var gulp = require('gulp');
var less = require('gulp-less');
var minify = require('gulp-minify-css');
var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var paths = {
  wipayCss: [
    '../maelWeb/static/maelWeb/css/forzen.css',
    "../maelWeb/static/maelWeb/css/Wipay.css"
  ],
  maelWebCss: [
    '../maelWeb/static/maelWeb/css/bootstrap.min.css',
    "../maelWeb/static/maelWeb/css/maelWeb.css"
  ],
  wipayScripts:[
   "../maelWeb/static/maelWeb/js/touch.js",
   "../maelWeb/static/maelWeb/js/Wipay.js"
  ],
  maelWebLess: [
    '../maelWeb/static/maelWeb/less/maelWeb.less'
  ],
  wipayLess: [
    '../maelWeb/static/maelWeb/less/Wipas.less'
  ],
  maelWebLessPartials: [
    '../maelWeb/static/maelWeb/less/base.less',
    '../maelWeb/static/maelWeb/less/login.less',
    '../maelWeb/static/maelWeb/less/store.less',
    '../maelWeb/static/maelWeb/less/setting.less',
    '../maelWeb/static/maelWeb/less/calender.less',
    '../maelWeb/static/maelWeb/less/cashier.less',
    '../maelWeb/static/maelWeb/less/report.less',
    '../maelWeb/static/maelWeb/less/validate.less'
  ],
  maelWebScripts:[
    "../maelWeb/static/maelWeb/js/ejs.js",
    "../maelWeb/static/maelWeb/js/common.js",
    "../maelWeb/static/maelWeb/js/WivalidVal.js",
    "../maelWeb/static/maelWeb/js/main.js",
    "../maelWeb/static/maelWeb/js/auth_init.js",
    "../maelWeb/static/maelWeb/js/login.js",
    "../maelWeb/static/maelWeb/js/setting.js",
    "../maelWeb/static/maelWeb/js/store.js",
    "../maelWeb/static/maelWeb/js/store_edit.js",
    "../maelWeb/static/maelWeb/js/cashier.js",
    "../maelWeb/static/maelWeb/js/report_detail.js",
    "../maelWeb/static/maelWeb/js/report_refund.js",
    "../maelWeb/static/maelWeb/js/account.js",
    "../maelWeb/static/maelWeb/js/validate.js"
  ],
  maelWebpack : "../maelWeb/static/maelWeb/pack",
  maelWebcss: "../maelWeb/static/maelWeb/css",
  maelWebjs : "../maelWeb/static/Wipos/js"
};

gulp.task('wipayjs', function () {
   gulp.src(paths.wipayScripts)
    .pipe(uglify())
    .pipe(gulp.dest(paths.wipospack));
});

gulp.task('wiposjs', function () {
  gulp.src(paths.wiposScripts)
    .pipe(concat("Wipos.min.js"))
    .pipe(gulp.dest(paths.wiposjs))
    .pipe(uglify())
    .pipe(gulp.dest(paths.wipospack));
});

gulp.task('wipaycss', function () {
    gulp.src(paths.wipayCss)
      .pipe(concatCss("Wipay.min.css"))
      .pipe(minify())
      .pipe(gulp.dest(paths.wipospack));
});

gulp.task('wipayless', function () {
    gulp.src(paths.wipayLess)
      .pipe(less())
      .pipe(gulp.dest(paths.wiposcss))
      .pipe(minify())
      .pipe(gulp.dest(paths.wipospack));
});

gulp.task('wiposcss', function () {
    gulp.src(paths.wiposCss)
      .pipe(concatCss("Wipos.min.css"))
      .pipe(minify())
      .pipe(gulp.dest(paths.wipospack));
});

gulp.task('wiposless', function () {
    gulp.src(paths.wiposLess)
      .pipe(less())
      .pipe(gulp.dest(paths.wiposcss));
});

// 监听任务，指定路径的文件变化后触发
gulp.task('watch', function() {
  gulp.watch(paths.wipayLess, ['wipayless']);
  gulp.watch(paths.wiposLessPartials, ['wiposless']);
  gulp.watch(paths.wipayCss, ['wipaycss']);
  gulp.watch(paths.wiposCss, ['wiposcss']);
  gulp.watch(paths.wipayScripts, ['wipayjs']);
  gulp.watch(paths.wiposScripts, ['wiposjs']);
});

// 默认任务（运行gulp以后触发）
gulp.task('default', ["wipayless", "wiposless", 'wipaycss', 'wiposcss', 'wipayjs', 'wiposjs', 'watch']);
