// 导入工具包 require(‘node_modules’里对应的模块)
const gulp = require('gulp'),
    pump = require('pump'),
    clean = require('gulp-clean'),
    cache = require('gulp-cached'),
    changed = require('gulp-changed'), // 检查文件是否改变
    htmlmin = require('gulp-htmlmin'), // 压缩html
    imagemin = require('gulp-imagemin'), // 压缩图片 格式很多（速度很快,压缩率很低）
    smushit = require('gulp-smushit'), // Yahoo开发的 只能优化PNG和JPG (速度慢,很慢,压缩率很高)
    ugLify = require('gulp-uglify'), // js压缩混淆
    concat = require('gulp-concat'), // 多个文件合并为一个
    cleanCSS = require('gulp-clean-css'), // 压缩css为一行
    less = require('gulp-less'), // less编译成css文件
    browserSync = require('browser-sync').create(), // 浏览器实时刷新\
    reload = browserSync.reload;

// 删除dist下面所有的文件
gulp.task('clean', (cb) => {
  pump([
    gulp.src('dist'),
    clean()
  ],cb);
})

// 定义一个less任务,(自定义任务名称)
gulp.task('less',() => {
  pump([
    gulp.src('src/less/*.less'),
    changed('dist/css', { extension:'.less' }),
    less(),
    concat('main.css'),
    cleanCSS(),
    gulp.dest('dist/css/')
  ]);

});

// 压缩JS
gulp.task('script', () => {
  gulp.src(['src/js/*.js'])
      .pipe(changed('dist/js', {hasChanged: changed.compareContents}))
      .pipe(ugLify()) // 混淆压缩JS
      .pipe(concat('index.js')) // 合并
      .pipe(gulp.dest('dist/js/')); // 将会在dist/js 下面生成index.js
  pump([
    gulp.src('src/js/*.js'),
    changed('dist/js', { extension:'.js' }),
    ugLify(),
    concat('index.js'),
    gulp.dest('dist/js/')
  ]);
});

// 压缩图片
gulp.task('image', () => {
  // gulp.src('src/images/*.{jpg,png}') // 只优化 jpg,png (也可以写成 *.*)
  //     .pipe(gulp.dest('dist/images')); // 将会在dist/images 下面压缩图片
  pump([
    gulp.src('src/images/*.*'),
    cache('move-images'),
    gulp.dest('dist/images')
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

gulp.task('serve', ['clean'], () => {
  gulp.start('script','less','html','image');
  browserSync.init({
    port:9088,
    server: {
      baseDir: ['dist']
    }
  });

  gulp.watch('src/js/*.js', ['script']).on("change", reload);
  gulp.watch('src/less/*.less', ['less']).on("change", reload);
  gulp.watch('src/*.html', ['html']).on("change", reload);
  gulp.watch('src/images/*.*', ['image']).on("change", reload);

});

gulp.task('default',['serve']);  // 定义默认任务 -- 开发环境
gulp.task('build', ['clean','script','less','html','image']); // 生产环境
//gulp.task('default', ['less', 'script', 'image', 'html']); // 定义默认任务

// gulp.task(name[, deps], fn) 定义任务 name:任务名称 deps:依赖任务名称 fn:回调函数
// gulp.src(globs[, options]) 执行任务处理的文件 globs: 处理文件的路径（字符串或者字符串数组）
// gulp.dest(path[, options]) 处理完后文件生成的路径
