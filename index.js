#!/usr/bin/env node

'use strict';

const program = require('commander');
const { cleanArgs } = require('./src/utilities');
const { processFiles } = require('./src/compress');

program
  .option('-s, --strategy <strategy>', 'Strategy to use for handling large properties', 'strip')
  .option('-i, --input <inputDir>', 'Input directory', 'build/contracts')
  .option('-o, --output <outputDir>', 'Output directory')
  .option('-k, --keep <keysToKeep>', 'Keys that you want to keep')
  .action(command => processFiles(cleanArgs(command)));

program.parse(process.argv);