handlebars = require 'handlebars'
sysPath = require 'path'

module.exports = class HandlebarsCompiler
  brunchPlugin: yes
  type: 'template'
  extension: 'hbs'
  pattern: /\.(?:hbs|handlebars)$/

  constructor: (@config) ->
    null
  compile: (data, path, callback) ->
    data = data
    .replace(/\r/gm, "\n") # remove Windows-style newlines
    .replace(/\n+/gm, " ") # remove duplicated newlines
    .replace(/<!--[^>]*-->/gm, '') # remove HTML comments
    .replace(/\s+/gm, " ") # remove duplicated spaces, tabs etc
    .replace(/^\s+|\s+$/gm, "") # multiline trim

    try
      content = handlebars.precompile data
      result = "module.exports = Handlebars.template(#{content});"
    catch err
      error = err
    finally
      callback error, result

  include: [
    (sysPath.join __dirname, '..', 'vendor',
      'handlebars.runtime-1.0.rc.1.js')
  ]
