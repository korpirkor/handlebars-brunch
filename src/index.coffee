handlebars = require 'handlebars'
umd = require 'umd-wrapper'
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
    .replace(/<!--[^>]*-->/gm, '') # remove HTML comments
    .replace(/\r/gm, "\n") # remove Windows-style newlines
    .replace(/^\s+|\s+$/gm, "") # multiline trim
    .replace(/\n+/gm, "\n") # remove duplicated newlines

    try
      result = umd "Handlebars.template(#{handlebars.precompile data})"
    catch err
      error = err
    finally
      callback error, result

  include: [
    (sysPath.join __dirname, '..', 'vendor',
      'handlebars.runtime-1.0.js')
  ]
