const gulp = require('gulp');
const through = require('through2');
const del = require('del');
const puppeteer = require('puppeteer');
const ansi = require('ansi');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const vinylPaths = require('vinyl-paths');
const cursor = ansi(process.stdout);

let totalWaitingTime = 0;


const shotIt = async (page, fileName) => {

    cursor.hex('#00ffff').bold();
    console.log("\nPreparing: "+fileName);
    cursor.reset();

    return new Promise(async(resolve, reject) => {
        try{
            //const page = await browser.newPage();
            await page.setUserAgent("puppeteer");

            cursor.hex('#ffff00').bold();
            console.log("\tOpening: http://localhost:3000/"+fileName);
            cursor.reset();

            await page.goto("http://localhost:3000/"+fileName);

            await page.setViewport({
              height: 900,
              width: 1400
            });

            const bodyHandle = await page.$('body');
            const { width, height } = await bodyHandle.boundingBox();

            const bbb = Date.now();
            const timeout = (ms) => {
                setTimeout(() => {}, 3000);
                return new Promise(resolve => setTimeout(resolve, ms));
            };
            console.log("\tWaiting...");
            await timeout(3000);
            let tWaiting = Date.now() - bbb;
            console.log("\tWaiting time: " + tWaiting + "ms");
            totalWaitingTime += tWaiting;

            cursor.hex('#ffffff').bold();
            console.log("\tTaking screenshot...");
            cursor.reset();

            await page.screenshot({
                clip: {
                    x: 0,
                    y: 0,
                    width,
                    height
                },
                path: "./dist/"+fileName.split(".html")[0]+".jpg"
            });

            cursor.hex('#00ff00').bold();
            console.log("\tShot Taken as "+fileName.split(".html")[0]+".jpg");
            cursor.reset();

            await bodyHandle.dispose();
            resolve();
        }catch(err){
            reject(err);
        };
    });
};


gulp.task('through', () => {
    const array = [];
    return gulp.src('./theme/**.html')
    .pipe(through.obj( (chunk, enc, cb) => {
        console.log(chunk.path);
        array.push(chunk.path.split("/")[chunk.path.split("/").length - 1])
        cb(null, chunk);
    })).on('end', async() => {
        const startTime = Date.now();
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        for(let pageName of array){
            try{
                await shotIt(page, pageName);
            }catch(err){
                console.log('failed', pageName, err);
            }
        };

        await browser.close();
        console.log("Total Waiting Time: " + totalWaitingTime/1000 + "s");
        console.log("Total Process Time: " + (Date.now() - startTime)/1000 + "s");

    });
});

gulp.task('shot', (callback) => {
  runSequence("through", callback);
});

gulp.task('rename', function() {
    return gulp.src('./dist/*.jpg')
        .pipe(vinylPaths(del))
        .pipe(rename({prefix: "dist--"}))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('default', (callback) => {
	runSequence("rename", "through", callback);
});
