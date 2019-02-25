#!/usr/bin/env node

'use strict';

const program = require('commander');
const { cleanArgs } = require('./src/utilities');
const { processFiles } = require('./src/compress');

program
  .option('-i, --input <inputDir>', 'Input directory', 'build/contracts')
  .option('-o, --output <outputDir>', 'Output directory')
  .option('-k, --keep <keysToKeep>', 'Keys that you want to keep')
  .option('-a --ast-object', 'Do not store object created from the ast interface content')
  .action(command => processFiles(cleanArgs(command)));

program.parse(process.argv);