// 导入工具包 require(‘node_modules’里对应的模块)
const gulp = require('gulp'),
    pump = require('pump'),
    clean = require('gulp-clean'),
    cache = require('gulp-cached'),
    plumber = require('gulp-plumber'), // 捕获处理任务中的错误
    changed = require('gulp-changed'), // 检查文件是否改变
    htmlmin = require('gulp-html-minifier-terser'), // 压缩html
    // imagemin = require('gulp-imagemin'), // 压缩图片 格式很多（速度很快,压缩率很低）
    // smushit = require('gulp-smushit'), // Yahoo开发的 只能优化PNG和JPG (速度慢,很慢,压缩率很高)
    ugLify = require('gulp-uglify'), // js压缩混淆
    concat = require('gulp-concat'), // 多个文件合并为一个
    cleanCSS = require('gulp-clean-css'), // 压缩css为一行
    less = require('gulp-less'), // less编译成css文件
    browserSync = require('browser-sync').create(), // 浏览器实时刷新\
    reload = browserSync.reload;

// 删除dist下面所有的文件
gulp.task('clean', (cb) => {
  pump([
    gulp.src(['dist', '*.zip']),
    clean()
  ],cb);
})

// 定义一个less任务,(自定义任务名称)
gulp.task('less',() => {
  pump([
    gulp.src('src/less/*.less'),
    plumber(),
    changed('dist/css', { extension:'.less' }),
    less(),
    concat('style.css'),
    cleanCSS(),
    gulp.dest('dist/css/')
  ]);
});

// 开发环境环境
gulp.task('dev-less', () => {
  pump([
    gulp.src('src/less/*.less'),
    plumber(),
    changed('dist/css', { extension:'.less' }),
    less(),
    concat('style.css'),
    gulp.dest('dist/css/')
  ]);
});

// 压缩JS
gulp.task('script', () => {
  pump([
    gulp.src('src/js/*.js'),
    changed('dist/js', { extension:'.js' }),
    ugLify(),
    // concat('index.js'),
    gulp.dest('dist/js/')
  ]);
});

gulp.task('dev-script', () => {
  pump([
    gulp.src('src/js/*.js'),
    changed('dist/js', { extension:'.js' }),
    gulp.dest('dist/js/')
  ]);
});

// 压缩图片
gulp.task('image', () => {
  pump([
    gulp.src('src/images/**/*'),
    cache('move-images'),
    gulp.dest('dist/images')
  ])
});

// 拷贝静态文件
gulp.task('copy', () => {
  pump([
    gulp.src('src/static/**/*'),
    gulp.dest('dist/static')
  ])
})

// 拷贝html
gulp.task('src', () => {
  const options = {
    removeComments: true, // 去除html的注释
    collapseWhitespace: true, // 压缩html (空格和退格符)
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
    minifyCSS: true, // 压缩页面css
    minifyJS: true // 压缩页面JS
  };
  pump([
    gulp.src('src/src/*.html'),
    htmlmin(options),
    gulp.dest('dist/src')
  ])
})

// 开发环境
gulp.task('dev-src', () => {
  pump([
    gulp.src('src/src/*.html'),
    gulp.dest('dist/src')
  ])
});

// 压缩HTLM（可能不需要）
gulp.task('html', () => {
  const options = {
    removeComments: true, // 去除html的注释
    collapseWhitespace: true, // 压缩html (空格和退格符)
    removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
    minifyCSS: true, // 压缩页面css
    minifyJS: true // 压缩页面JS
  };
  pump([
    gulp.src('src/*.html'),
    htmlmin(options),
    gulp.dest('dist')
  ])
});
// 开发环境
gulp.task('dev-html', () => {
  pump([
    gulp.src('src/*.html'),
    htmlmin({ collapseWhitespace: true }),
    gulp.dest('dist')
  ])
});
// 热更新服务
gulp.task('serve', ['clean'], () => {
  gulp.start('dev-script','dev-less','dev-html','dev-src','image', 'copy');
  browserSync.init({
    port:9088,
    server: {
      baseDir: ['dist']
    }
  });

  gulp.watch('src/js/*.js', ['script']).on("change", reload);
  gulp.watch('src/less/*.less', ['dev-less']).on("change", reload);
  gulp.watch('src/*.html', ['dev-html']).on("change", reload);
  gulp.watch('src/src/*.html', ['dev-src']).on("change", reload);
  gulp.watch('src/images/**/*', ['image']).on("change", reload);
  gulp.watch('src/static/**/*', ['copy']).on("change", reload);

});

gulp.task('default',['serve']);  // 定义默认任务 -- 开发环境  $ gulp
// 生产环境  $gulp build
gulp.task('build', ['clean'], () => {
  gulp.start('html', 'script', 'less', 'src', 'image', 'copy');
});
