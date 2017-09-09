"use strict";

const bump = require( "@textpress/bump-version" ).bump;
const gulp = require( "gulp" );
const argv = require( "yargs" ).argv;

gulp.task( "bump", () => bump( argv.version ) );

