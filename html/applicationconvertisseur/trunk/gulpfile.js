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

gulp.task('minify-html', function() {
    var opts = {
        conditionals: true,
        spare:true
    };

    return gulp.src(dirs.src +'/*.html')
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
        'clean', 'copy','lint', 'minify-css', 'minify-html', 'minify-js','opt-images',
        done);
});

gulp.task('default', ['build']);
