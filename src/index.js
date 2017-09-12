import confirm from "gulp-confirm";
import exec from "gulp-exec";
import gulp from "gulp";
import gutil from "gulp-util";
import fs from "fs";
import path from "path";
import yargs from "yargs";

export function currentVersion() {
    const { version } = JSON.parse( fs.readFileSync( path.join( process.cwd(), "package.json" ) ) );
    return version;
}

export function bump( version ) {
    version = version === true ? "minor" : version;
    const versions = [ "major", "minor", "patch" ];
    if ( versions.indexOf( version ) === -1 ) {
        return gulp.src( "" )
            .emit( 'error', new gutil.PluginError( "bump-version", "Unknown value of version argument: " + version + ". Acceptable values: " + versions.join( ", " ) ) )
            ;
    }

    return gulp.src( "" )
        .pipe( confirm( {
            question: `\x1B[37mCurrent version is \x1B[4m\x1B[36m${currentVersion()}\x1B[24m\x1B[37m. Bump \x1B[4m\x1B[36m${version}\x1B[24m\x1B[37m version?\x1B[22m`,
            input: "_key:y"
        } ) )
        .pipe( exec( "git push origin master --tags" ) ) // push leftovers to reduce number of entities in version push
        .pipe( exec( `npm version ${version}` ) )
        .pipe( exec( "git push origin master --tags" ) )
        .on( "finish", () => {
            gutil.log( `\x1B[37mNew version is \x1B[4m\x1B[36m${currentVersion()}\x1B[24m\x1B[37m.` );
        } );
}

export function registerTask() {
    gulp.task( "bump", () => bump( yargs.argv.part ) ); // don't use --version, because yargs.argv considers it and --help as special cases
}

export default bump;
