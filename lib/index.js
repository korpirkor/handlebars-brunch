var HandlebarsCompiler, handlebars, sysPath;

handlebars = require('handlebars');

sysPath = require('path');

module.exports = HandlebarsCompiler = (function() {
  var regexp;

  HandlebarsCompiler.prototype.brunchPlugin = true;

  HandlebarsCompiler.prototype.type = 'template';

  HandlebarsCompiler.prototype.extension = 'hbs';

  HandlebarsCompiler.prototype.pattern = /\.(?:hbs|handlebars)$/;

  function HandlebarsCompiler(config) {
    this.config = config;
    null;
  }

  regexp = {
    win_newline: /\r/gm,
    duplicated_newline: /\n+/gm,
    html_comments: /<!--(.|\n)*?-->/gm,
    spaces: /\s+/gm,
    trim: /^\s+|\s+$/gm
  };

  HandlebarsCompiler.prototype.compile = function(data, path, callback) {
    var content, error, i, result;
    data = data.replace(regexp.win_newline, "\n").replace(regexp.duplicated_newline, " ").replace(regexp.html_comments, '').replace(regexp.spaces, " ").replace(regexp.trim, "");
    for (i in regexp) {
      regexp.lastIndex = 0;
    }
    try {
      content = handlebars.precompile(data);
      return result = "module.exports = Handlebars.template(" + content + ");";
    } catch (err) {
      return error = err;
    } finally {
      callback(error, result);
    }
  };

  HandlebarsCompiler.prototype.include = [sysPath.join(__dirname, '..', 'vendor', 'handlebars.runtime-1.0.rc.1.js')];

  return HandlebarsCompiler;

})();
