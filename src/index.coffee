handlebars = require 'handlebars'
sysPath = require 'path'

module.exports = class HandlebarsCompiler
  brunchPlugin: yes
  type: 'template'
  extension: 'hbs'
  pattern: /\.(?:hbs|handlebars)$/

  constructor: (@config) ->
    null

  regexp = 
    win_newline: /\r/gm
    duplicated_newline: /\n+/gm
    html_comments: /<!--(.|\n)*?-->/gm
    spaces: /\s+/gm
    trim: /^\s+|\s+$/gm

  compile: (data, path, callback) ->
    data = data
    .replace(regexp.win_newline, "\n") # remove Windows-style newlines
    .replace(regexp.duplicated_newline, " ") # remove duplicated newlines
    .replace(regexp.html_comments, '') # remove HTML comments
    .replace(regexp.spaces, " ") # remove duplicated spaces, tabs etc
    .replace(regexp.trim, "") # multiline trim

    for i of regexp
      regexp.lastIndex = 0 # to prevent weird behaviour of regexp

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
