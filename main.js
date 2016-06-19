/*global require:true */
const fs = require('fs');
const process = require('process');
const parser = require('./parser');
const path = require('path');
const reporter = require('./reporter');


var main = function(args) {
  var outputDir = 'generated';
  var outputPath = path.join(outputDir, 'result.html');
  var content = fs.createReadStream(args[2], 'utf-8');
  parser.run(content, function(tap) {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    var writer = fs.createWriteStream(outputPath, 'utf-8');
    reporter.run(tap, writer);
  });
};

main(process.argv);
