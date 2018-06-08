// 导入工具包 require(‘node_modules’里对应的模块)
const gulp = require('gulp'),
    debug = require('gulp-debug'), // debug
    changed = require('gulp-changed'), // 检查文件是否改变
    htmlmin = require('gulp-htmlmin'), // 压缩html
    imagemin = require('gulp-imagemin'), // 压缩图片 格式很多（速度很快,压缩率很低）
    // pngquant = require('imagemin-pngquant'), // 深度压缩PNG （没效果暂时废弃）
    smushit = require('gulp-smushit'), // Yahoo开发的 只能优化PNG和JPG (速度慢,很慢,压缩率很高)
    ugLify = require('gulp-uglify'), // js压缩混淆
    concat = require('gulp-concat'), // 多个文件合并为一个
    cleanCSS = require('gulp-clean-css'), // 压缩css为一行
    less = require('gulp-less'), // less编译成css文件
    del = require('del'),
    browserSync = require('browser-sync').create(), // 浏览器实时刷新\
    reload = browserSync.reload;

// 删除dist下面所有的文件
gulp.task('delete', (cb) => {
  return del(['dist/*', '!dist/images'], cb);
})

// 定义一个less任务,(自定义任务名称)
gulp.task('less',() => {
  gulp.src(['src/less/*.less']) // 该任务针对的文件,多个文件以数组形式传入
      .pipe(changed('dist/css', {hasChanged: changed.compareContents})) // 因为会对所有文件进行合并所以changed并没有发挥作用？
      .pipe(less()) // 该任务调用的模块
      .pipe(debug({title: '编译:'}))
      .pipe(concat('main.css')) // 合并css的名字main.css
      .pipe(cleanCSS()) // 压缩新生成的css
      .pipe(gulp.dest('dist/css/')); // 将会在src/css 下面生成index.css
});

// 压缩JS
gulp.task('script', () => {
  gulp.src(['src/js/*.js'])
      .pipe(changed('dist/js', {hasChanged: changed.compareContents}))
      .pipe(debug({title: '编译:'}))
      .pipe(ugLify()) // 混淆压缩JS
      .pipe(concat('index.js')) // 合并
      .pipe(gulp.dest('dist/js/')); // 将会在dist/js 下面生成index.js
});

// 压缩图片
gulp.task('image', () => {
  gulp.src('src/images/*.{jpg,png}') // 只优化 jpg,png (也可以写成 *.*)
      // versions < 3 的写法(老版本)
      // .pipe(imagemin({
      //   progressive: true, // 无损压缩JPG图片
      //   svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
      //   use: [pngquant()] // 使用pngquant插件进行深度压缩
      // }))

      // latest 4.1.0 (目前最新)
      // .pipe(imagemin([
      //     imagemin.gifsicle({interlaced: true}), // gif 压缩
      //     imagemin.jpegtran({progressive: true}), //jpg 无损压缩
      //     imagemin.optipng({optimizationLevel: 5}), // png 优化登记
      //     imagemin.svgo({
      //         plugins: [
      //             {removeViewBox: true},
      //             {cleanupIDs: false}
      //         ]
      //     })
      // ]))
      .pipe(changed('dist/images', {hasChanged: changed.compareLastModifiedTime})) // 对文件最后修改时间进行比对
      .pipe(smushit({
            verbose: true // 显示压缩信息（可以去掉,一度以为卡掉了）
        }))

      .pipe(debug({title: '编译:'}))
      .pipe(gulp.dest('dist/images')); // 将会在dist/images 下面压缩图片
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
  gulp.src('src/*.html')
      // .pipe(changed('dist/images', {hasChanged: changed.compareContents})) // 对文件内容进行比对
      .pipe(htmlmin(options))
      .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['delete'], () => {
  gulp.start('script','less','html');
  browserSync.init({
    // proxy: '192.168.0.7',
    port:9088,
    server: {
      baseDir: ['dist']
    }
  });

  gulp.watch('src/js/*.js', ['script']).on("change", reload);
  gulp.watch('src/less/*.less', ['less']).on("change", reload);
  gulp.watch('src/*.html', ['html']).on("change", reload);
  gulp.watch('src/images/*.*', ['images']).on("change", reload);

})

gulp.task('default',['serve']);  // 定义默认任务
//gulp.task('default', ['less', 'script', 'image', 'html']); // 定义默认任务

// gulp.task(name[, deps], fn) 定义任务 name:任务名称 deps:依赖任务名称 fn:回调函数
// gulp.src(globs[, options]) 执行任务处理的文件 globs: 处理文件的路径（字符串或者字符串数组）
// gulp.dest(path[, options]) 处理完后文件生成的路径
