/*global require:true, module:true */
const fs = require('fs');
const parser = require('tap-parser');
const process = require('process');

var TapParser = function(content, callback) {
  var self = this;
  this.content = content;
  this.parser = parser();
  this.result = {
    asserts: []
  };
  this.parser.on('assert', function(assert) {
    var newAssert = {
      id: assert.id,
      ok: assert.ok,
      name: assert.name
    };
    if (assert.diag) {
      newAssert.message = assert.diag.message || "";
      if (assert.diag.Log) {
        newAssert.hasLog = true;
        newAssert.log = assert.diag.Log
              .replace(/{ type: '(.+)',\n +/g, '{ type: \'$1\', ')
              .split(/\n/).filter(function(line) {
                return line !== '';
              }).map(function(line) {
                var unsafeObject;
                eval('unsafeObject = ' + line);
                return unsafeObject;
              });
      }
    }
    self.result.asserts.push(newAssert);
  });
  this.parser.on('complete', function() {
    if (callback) {
      callback(self.result);
    }
  });
};

TapParser.prototype.run = function() {
  this.content.pipe(this.parser);
};

module.exports = {
  run: function(content, callback) {
    var parser = new TapParser(content, callback);
    return parser.run();
  }
};
