import confirm from "gulp-confirm";
import chalk from "chalk";
import PluginError from "plugin-error";
import exec from "gulp-exec";
import print from "gulp-print";
import gulp from "gulp";
import log from "fancy-log";
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
            .emit( "error", new PluginError( "bump-version",
                chalk`{bgRed {whiteBright Unknown value of version argument: {cyan ${version}}. Acceptable values: {cyan ${versions.join( ", " )}}.}}`
            ) );
    }

    return gulp.src( "package.json" )
        .pipe( confirm( {
            question: chalk`{white Current version is {cyan ${currentVersion()}}. Bump {cyan ${version}} version?}`,
            input: "_key:y"
        } ) )
        .pipe( exec( "git push origin master --tags" ) ) // push leftovers to reduce number of entities in version push
        .pipe( exec( `npm version ${version}` ) )
        .pipe( exec( "git push origin master --tags" ) )
        .pipe( print( () => {
            log( chalk`{bgRed {whiteBright New version is {cyan ${currentVersion()}}.}}` );
        } ) )
    ;
}

export function registerTask() {
    gulp.task( "bump", () => bump( yargs.argv.part ) ); // don't use --version, because yargs.argv considers it and --help as special cases
}

export default bump;
