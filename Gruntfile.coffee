module.exports = (grunt) ->
  "use strict"
  path = require("path")

  # Sniff packages.json for all availabe grunt tasks.
  require("load-grunt-tasks")(grunt)

  # Load tasks in tasks/ folder.
  config = require('load-grunt-config')(grunt,
    defaultPath : path.join(__dirname, "tasks")
    init        : no
  )

  grunt.initConfig config,
    pkg: grunt.file.readJSON("package.json")


  grunt.registerTask("default", ["concat:build"])
