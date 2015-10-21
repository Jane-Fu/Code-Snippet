var gulp = require('gulp');
var less = require('gulp-less');
var minify = require('gulp-minify-css');
var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var paths = {
  wipayCss: [
    '../WiPos/static/Wipos/css/forzen.css',
    "../WiPos/static/Wipos/css/Wipay.css"
  ],
  wiposCss: [
    '../WiPos/static/Wipos/css/bootstrap.min.css',
    "../WiPos/static/Wipos/css/Wipos.css"
  ],
  wipayScripts:[
   "../WiPos/static/Wipos/js/touch.js",
   "../WiPos/static/Wipos/js/Wipay.js"
  ],
  wiposLess: [
    '../WiPos/static/Wipos/less/Wipos.less'
  ],
  wipayLess: [
    '../WiPos/static/Wipos/less/Wipas.less'
  ],
  wiposLessPartials: [
    '../WiPos/static/Wipos/less/base.less',
    '../WiPos/static/Wipos/less/login.less',
    '../WiPos/static/Wipos/less/store.less',
    '../WiPos/static/Wipos/less/setting.less',
    '../WiPos/static/Wipos/less/calender.less',
    '../WiPos/static/Wipos/less/cashier.less',
    '../WiPos/static/Wipos/less/report.less',
    '../WiPos/static/Wipos/less/validate.less'
  ],
  wiposScripts:[
    "../WiPos/static/Wipos/js/ejs.js",
    "../WiPos/static/Wipos/js/common.js",
    "../WiPos/static/Wipos/js/WivalidVal.js",
    "../WiPos/static/Wipos/js/main.js",
    "../WiPos/static/Wipos/js/auth_init.js",
    "../WiPos/static/Wipos/js/login.js",
    "../WiPos/static/Wipos/js/setting.js",
    "../WiPos/static/Wipos/js/store.js",
    "../WiPos/static/Wipos/js/store_edit.js",
    "../WiPos/static/Wipos/js/cashier.js",
    "../WiPos/static/Wipos/js/report_detail.js",
    "../WiPos/static/Wipos/js/report_refund.js",
    "../WiPos/static/Wipos/js/account.js",
    "../WiPos/static/Wipos/js/validate.js"
  ],
  wipospack : "../WiPos/static/Wipos/pack",
  wiposcss: "../WiPos/static/Wipos/css",
  wiposjs : "../WiPos/static/Wipos/js"
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
