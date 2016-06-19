/*global require:true, module:true */
const fs = require('fs');
const mustache = require('mustache');
const process = require('process');

var HtmlReporter = function(tap, output) {
  this.tap = tap;
  this.output = output || process.stdout;
};

HtmlReporter.prototype.run = function(templatePath) {
  var template = fs.readFileSync(templatePath, 'utf-8');
  var html = mustache.render(template, this.tap);
  this.output.write(html);
};

module.exports = {
  run: function(tap, output) {
    var reporter = new HtmlReporter(tap, output);
    reporter.run('index.mustache');
  }
};
