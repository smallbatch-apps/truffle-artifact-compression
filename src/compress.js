const fs = require('fs');
const path = require('path');

const { loadAll } = require('ast-functions');

const { STRATEGY_KEEP_ALL, STRATEGY_LOAD_AST } = require('./utilities');

const objectKeys = ['source', 'ast', 'legacyAST', 'sourceMap', 'deployedSourceMap', 'bytecode', 'deployedBytecode'];

const processFiles = ({input, output, strategy, keep}) => {
  const readPath = path.resolve(process.cwd(), input);
  fs.readdir(readPath, (err, files) => {
    const jsonFilesArray = files
      .filter(fileName => {
        return fileName.substring(fileName.length - 5, fileName.length) === '.json'
          && fileName !== 'package.json'
          && fileName !== 'package-lock.json';
      });

    if (!jsonFilesArray.length) {
      throw Error('No json files found');
    }

    output = !output ? readPath : output;

    jsonFilesArray.forEach(file => {
      const inputFile = path.resolve(process.cwd(), input, file);
      const outputFile = path.resolve(process.cwd(), output, file);
      compress(inputFile, outputFile, strategy, keep);
    });

  });
}

const resolveFile = file => {
  const filePath = path.resolve(process.cwd(), file);
  const fileContents = fs.readFileSync(filePath, { encoding: 'utf8' });
  return JSON.parse(fileContents);
}

const compress = (inputFile, outputFile, strategy, keepKeys) => {
  const artifactObject = resolveFile(inputFile);

  keysToRemove(strategy, keepKeys)
    .forEach(key => delete artifactObject[key]);

  if (strategy === STRATEGY_LOAD_AST) {
    artifactObject.astObjects = loadAll(artifactObject.ast);
  }

  fs.writeFileSync(outputFile, JSON.stringify(artifactObject, null, 0));
};

const keysToRemove = (strategy, keepKeys) => {
  if (strategy === STRATEGY_KEEP_ALL) return [];
  return objectKeys.filter(key => !keepKeys.includes(key));
}

module.exports = { compress, processFiles };