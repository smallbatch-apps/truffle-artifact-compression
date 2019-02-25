const fs = require('fs');
const path = require('path');

const { loadAll } = require('ast-functions');

const objectKeys = ['source', 'ast', 'legacyAST', 'sourceMap', 'deployedSourceMap', 'bytecode', 'deployedBytecode'];

const processFiles = ({input, output, keep, astObject}) => {
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
      compress(inputFile, outputFile, keep, astObject);
    });

  });
}

const resolveFile = file => {
  const filePath = path.resolve(process.cwd(), file);
  const fileContents = fs.readFileSync(filePath, { encoding: 'utf8' });
  return JSON.parse(fileContents);
}

const compress = (inputFile, outputFile, keepKeys, astObject) => {
  const artifactObject = resolveFile(inputFile);

  if (astObject) {
    artifactObject.astObject = loadAll(artifactObject.ast);
  }

  objectKeys.filter(key => !keepKeys.includes(key))
    .forEach(key => delete artifactObject[key]);

  fs.writeFileSync(outputFile, JSON.stringify(artifactObject, null, 0));
};

module.exports = { compress, processFiles };