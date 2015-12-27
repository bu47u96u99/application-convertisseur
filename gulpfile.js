var gulp = require('gulp');

var plugins = require('gulp-load-plugins')();


// Import dependencies
var jshint = require('gulp-jshint'),
    less   = require('gulp-less'),
    recess = require('gulp-recess'),
    minifyCSS = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    uglify = require('gulp-uglify'),
    imageop = require('gulp-image-optimization'),
    path   = require('path'),
    fs = require('fs'),
    pkg = require('./package.json'),
    runSequence = require('run-sequence').use(gulp);
// icons
var realFavicon = require('gulp-real-favicon');
// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';
// conf
var dirs = pkg['h5bp-configs'].directories;

// Lint Task
gulp.task('lint', function () {
    gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// minify CSS
gulp.task('minify-css', function () {
    gulp.src(dirs.src +'/css/*.css')
        .pipe(recess()) // Linting CSS
        .pipe(minifyCSS()) // Minify CSS
        .pipe(gulp.dest(dirs.dist + '/css'));
});

// Archive create dir
gulp.task('archive:create_archive_dir', function () {
    fs.mkdirSync(path.resolve(dirs.archive), '0755');
});

// Archive create zip
gulp.task('archive:zip', function (done) {
    var archiveName = path.resolve(dirs.archive, pkg.name /*+ '_v' + pkg.version*/ + '.zip');
    var archiver = require('archiver')('zip');
    var files = require('glob').sync('**/*.*', {
        'cwd': dirs.dist,
        'dot': true // include hidden files
    });
    var output = fs.createWriteStream(archiveName);
    archiver.on('error', function (error) {
        done();
        throw error;
    });
    output.on('close', done);
    files.forEach(function (file) {
        var filePath = path.resolve(dirs.dist, file);
        archiver.append(fs.createReadStream(filePath), {
            'name': file,
            'mode': fs.statSync(filePath)
        });
    });
    archiver.pipe(output);
    archiver.finalize();
});

// clean
gulp.task('clean', function (done) {
    require('del')([
        dirs.archive,
        dirs.dist
    ]).then(function () {
        done();
    });
});

// copy
gulp.task('copy', [
    'copy:jquery',
    'copy:.htaccess',
    'copy:license',
    'copy:misc'
]);

gulp.task('copy:.htaccess', function () {
    return gulp.src('node_modules/apache-server-configs/dist/.htaccess')
        .pipe(plugins.replace(/# ErrorDocument/g, 'ErrorDocument'))
        .pipe(gulp.dest(dirs.dist));
});


gulp.task('copy:jquery', function () {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js'])
        .pipe(plugins.rename('jquery-' + pkg.devDependencies.jquery + '.min.js'))
        .pipe(gulp.dest(dirs.dist + '/js/vendor'));
});

gulp.task('copy:license', function () {
    return gulp.src('LICENSE.txt')
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:misc', function () {
    return gulp.src([
        // Copy all files
        dirs.src + '/**/*',
        // Exclude the following files
        // (other tasks will handle the copying of these files)
        '!' + dirs.src + '/css/*.css',
        '!' + dirs.src + '/*.html',
        '!' + dirs.src + '/js/*.js',
        '!' + dirs.src + '/.editorconfig',
        '!' + dirs.src + '/.gitattributes',
        '!' + dirs.src + '/.gitignore',
        '!' + dirs.src + '/img/*.png',
        '!' + dirs.src + '/img/*.gif',
        '!' + dirs.src + '/img/*.jpg',
        '!' + dirs.src + '/img/*.jpeg'
    ], {
        // Include hidden files by default
        dot: true
    }).pipe(gulp.dest(dirs.dist));
});

gulp.task('minify-js', function() {
    return gulp.src(dirs.src + '/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(dirs.dist+'/js'));
});

gulp.task('copy-html', function () {
    return gulp.src(dirs.src + '/*.html')
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('minify-html', function() {
    var opts = {
        conditionals: true,
        spare:true
    };

    return gulp.src(dirs.dist + '/*.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('opt-images', function(cb) {
    gulp.src([dirs.src + '/img/*.png',dirs.src + '/img/*.jpg',dirs.src + '/img/*.gif',dirs.src + '/img/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest(dirs.dist +'/img')).on('end', cb).on('error', cb);
});


// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function (done) {
    realFavicon.generateFavicon({
        masterPicture: dirs.src + '/img/img.png',
        dest: dirs.dist + '/img/icons',
        iconsPath: 'img/icons',
        design: {
            ios: {
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#ffffff',
                margin: '14%'
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#da532c',
                onConflict: 'override'
            },
            androidChrome: {
                pictureAspect: 'backgroundAndMargin',
                margin: '8%',
                backgroundColor: '#ffffff',
                themeColor: '#ffffff',
                manifest: {
                    name: 'Application convertisseur',
                    display: 'browser',
                    orientation: 'notSet',
                    onConflict: 'override'
                }
            },
            safariPinnedTab: {
                pictureAspect: 'blackAndWhite',
                threshold: 50,
                themeColor: '#5bbad5'
            }
        },
        settings: {
            compression: 5,
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        markupFile: FAVICON_DATA_FILE
    }, function () {
        done();
    });
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function () {
    gulp.src([dirs.dist + '/*.html'])
        .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
        .pipe(gulp.dest(dirs.dist));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function (done) {
    var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
    realFavicon.checkForUpdates(currentVersion, function (err) {
        if (err) {
            throw err;
        }
    });
});


// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('archive', function (done) {
    runSequence(
        'build',
        'archive:create_archive_dir',
        'archive:zip',
        done);
});

/* copy:css a part bug */
gulp.task('build', function (done) {
    runSequence(
        'clean', 'copy', 'lint', 'copy-html', 'generate-favicon', 'inject-favicon-markups', 'minify-css', 'minify-js', 'opt-images', 'minify-html',
        done);
});

gulp.task('default', ['build']);
