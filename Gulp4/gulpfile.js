const {src,dest,parallel,series, watch} = require('gulp');
const sass = require('gulp-sass'); // обработка sass
const notify =require('gulp-notify'); // Обработка ошибок
const rename = require('gulp-rename'); // Изменение имени файлов
const autoprefixer = require('gulp-autoprefixer'); // Авто префиксы
const cleanCSS = require('gulp-clean-css'); // Очистка css
const sourcemaps = require('gulp-sourcemaps'); // Форматирование
const browserSync =require('browser-sync').create(); // Авто обновление
const fileinclude = require('gulp-file-include'); // Обработка Html
const svgSprite = require('gulp-svg-sprite'); // Обработка Svg
const ttf2woff = require('gulp-ttf2woff'); // Обработка форматов
const ttf2woff2 = require('gulp-ttf2woff2'); // Обработка форматов
const fs = require('fs'); // Чтение файлов
const del = require('del'); // Удаление 
const webpack = require('webpack'); // Для работы c js
const webpackStream = require('webpack-stream'); //Для работы c js
const uglify = require('gulp-uglify-es').default; //Для работы c js
const tiny = require('gulp-tinypng-compress'); // Сжатие картинок


// Обработка шрифтов
const fonts = () =>{
    src('./src/fonts/**.ttf')
        .pipe(ttf2woff())
        .pipe(dest('./app/fonts/'))
    return src('./src/fonts/**.ttf')
        .pipe(ttf2woff2())
        .pipe(dest('./app/fonts/'))
} 

const cb = () => {}

let srcFonts = './src/scss/_fonts.scss';
let appFonts = './app/fonts/';
// Добавления шрифтов
const fontsStyle = (done) => {
	let file_content = fs.readFileSync(srcFonts);

	fs.writeFile(srcFonts, '', cb);
	fs.readdir(appFonts, function (err, items) {
		if (items) {
			let c_fontname;
			for (var i = 0; i < items.length; i++) {
				let fontname = items[i].split('.');
				fontname = fontname[0];
				if (c_fontname != fontname) {
					fs.appendFile(srcFonts, '@include font-face("' + fontname + '", "' + fontname + '", 400);\r\n', cb);
				}
				c_fontname = fontname;
			}
		}
	})

	done();
}
// Обработка стилей
 const styles = () => {
    return src('./src/scss/**/*.scss')
            .pipe(sourcemaps.init())
            .pipe(sass({
                outputStyle: 'expanded'
            }).on('error',notify.onError()))
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(autoprefixer({
                cascade: false,
            }))
            .pipe(cleanCSS({
                level: 2,
            }))
            .pipe(sourcemaps.write('.'))
            .pipe(dest('./app/css'))
            .pipe(browserSync.stream());
 };
// Обработка HTML
 const htmlInclude = () => {
     return src(['./src/index.html'])
            .pipe(fileinclude({
                prefix: '@',
                basepath: '@file'
            }))
            .pipe(dest('./app'))
            .pipe(browserSync.stream());
 }

// Обработка картинок(jpg, png, jpeg)
 const imgToApp = () => {
     return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg'])
            .pipe(dest('./app/img'))
 }

//  Обработка Svg
 const svgSprites = () => {
     return src('./src/img/**.svg')
     .pipe(svgSprite({
         mode:{
             stack:{
                 sprite:'../sprite.svg'
             }
         }
     }))
     .pipe(dest('./app/img'))
 }

//  Обработка доп. файлов
 const resources = () => {
     return src('.src/resources/**')
            .pipe(dest('./app/resources'))
 }

// Удаление App
 const clean = () => {
     return del('app/**')
 }
// Обработка скриптов
 const scripts = () =>{
     return src('./src/js/main.js')
            .pipe(webpackStream({
                output:{
                    filename:'main.js',
                },
                module: {
                    rules: [
                      {
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                          loader: 'babel-loader',
                          options: {
                            presets: ['@babel/preset-env']
                          }
                        }
                      }
                    ]
                  }

            }))
            .pipe(sourcemaps.init())
            .pipe(uglify().on('error',notify.onError()))
            .pipe(sourcemaps.write('.'))
            .pipe(dest('./app/js'))
            .pipe(browserSync.stream());
 }


//Прослушка изменений
 const watchFiles = () => {
     browserSync.init({
         server:{
             baseDir: './app'
         }
     })

     watch('./src/scss/**/*.scss' , styles)
     watch('./src/index.html' , htmlInclude)
     watch('./src/img/**.jpg' , imgToApp)
     watch('./src/img/**.png' , imgToApp)
     watch('./src/img/**.jpeg' , imgToApp)
     watch('./src/img/**.svg' , svgSprites)
     watch('./src/resources/**' , resources)
     watch('./src/fonts/**.ttf' , fonts)
     watch('./src/fonts/**.ttf' , fontsStyle)
     watch('./src/js/**/*.js', scripts)
 };

//  exports.styles = styles;
//  exports.watchFiles = watchFiles;
//  exports.htmlInclude = htmlInclude;
 exports.default =series(clean, parallel(htmlInclude, scripts, fonts, resources, imgToApp, svgSprites), fontsStyle, styles, watchFiles);


 const tipypng = () => {
        return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg'])
            .pipe(tiny({
                key: 'WbGH5tL1x0PzgHbfCqTtc8TGPwNkXYDg',
                log: true,
            }))
            .pipe(dest('./app/img'))
 }

 const stylesBuild = () => {
    return src('./src/scss/**/*.scss')
            
            .pipe(sass({
                outputStyle: 'expanded'
            }).on('error',notify.onError()))
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(autoprefixer({
                cascade: false,
            }))
            .pipe(cleanCSS({
                level: 2,
            }))
            
            .pipe(dest('./app/css'))
            
 };

 const scriptsBuild = () =>{
    return src('./src/js/main.js')
           .pipe(webpackStream({
               output:{
                   filename:'main.js',
               },
               module: {
                   rules: [
                     {
                       test: /\.m?js$/,
                       exclude: /(node_modules|bower_components)/,
                       use: {
                         loader: 'babel-loader',
                         options: {
                           presets: ['@babel/preset-env']
                         }
                       }
                     }
                   ]
                 }

           }))
           .pipe(uglify().on('error',notify.onError()))
           .pipe(dest('./app/js'))
}

exports.build =series(clean, parallel(htmlInclude, scriptsBuild, fonts, resources, imgToApp, svgSprites), fontsStyle, stylesBuild, tipypng)
