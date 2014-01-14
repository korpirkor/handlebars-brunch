var handlebars = require('handlebars');
var umd = require('umd-wrapper');
var sysPath = require('path');
var htmlMinifier = require('html-minifier');
var htmlMinify = require('html-minify');
var regexpMinifier = {
  win_newline: [/\r/gm,"\n"], // remove Windows-style newlines
  duplicated_newline: [/\n+/gm," "], // remove newlines
  html_comments: [/<!--(.|\n)*?-->/gm, ''], // remove HTML comments
  spaces: [/\s+/gm, " "], // remove duplicated spaces, tabs etc
  trim: [/^\s+|\s+$/gm, ''] // multiline trim
};

function HandlebarsCompiler(cfg) {
  if (cfg == null) cfg = {};
  this.optimize = cfg.optimize;
  var config = cfg.plugins && cfg.plugins.handlebars;
  if (config) {
    var overrides = config.overrides;
    if (typeof overrides === 'function') overrides(handlebars);
    this.namespace = config.namespace;
    this.pathReplace = config.pathReplace || this.pathReplace;
    if (config.include) this.includeSettings = config.include;
    // JSON.parse(JSON.stringify(X)) == clone(X)
    this.precompileConfig = config.precompileConfig ? JSON.parse(JSON.stringify(config.precompileConfig)) : undefined;
    this.minifyHtml = config.minifyHtml;
    this.minifyPlugin = config.minifyPlugin;
  }
  this.setInclude();
}

HandlebarsCompiler.prototype.setInclude = function() {
  var include = this.includeSettings || {};
  if (include.enabled === false) {
    delete HandlebarsCompiler.prototype.include;
    return;
  }
  var includeFile = 'handlebars';
  if (include.runtime || include.runtime == null) includeFile += '.runtime';
  if (include.amd) includeFile += '.amd';
  if (this.optimize) includeFile += '.min';
  includeFile += '.js';
  HandlebarsCompiler.prototype.include = [
    sysPath.join(__dirname, 'node_modules', 'handlebars', 'dist', includeFile)
  ];
};

HandlebarsCompiler.prototype.brunchPlugin = true;
HandlebarsCompiler.prototype.type = 'template';
HandlebarsCompiler.prototype.extension = 'hbs';
HandlebarsCompiler.prototype.pattern = /\.(?:hbs|handlebars)$/;
HandlebarsCompiler.prototype.pathReplace = /^.*templates\//;


HandlebarsCompiler.prototype.compile = function(data, path, callback) {
  var error, key, ns, result, source;
  try {
    if(this.minifyHtml) {
      var minifyOptions = typeof this.minifyHtml === 'object' ? this.minifyHtml : undefined;
      if(this.minifyPlugin == 'html-minifier') {
        data = htmlMinifier.minify(data, minifyOptions);
      } else if (this.minifyPlugin == 'html-minify'){
        data = htmlMinify(data, minifyOptions);
      } else {
        for (var i in regexpMinifier) {
          data = data.replace(regexpMinifier[i][0], regexpMinifier[i][1])
          regexpMinifier[i].lastIndex = 0;
        }
      }
    }
    source = "Handlebars.template(" + (handlebars.precompile(data, this.precompileConfig)) + ")";
    result = this.namespace ? (ns = this.namespace, key = path.replace(this.pathReplace, '').replace(/\..+?$/, ''), "if (typeof " + ns + " === 'undefined'){ " + ns + " = {} }; " + ns + "['" + key + "'] = " + source) : umd(source);
  } catch (_error) {
    error = _error;
  }
  if (error) return callback(error);
  return callback(null, result);
};

module.exports = HandlebarsCompiler;
