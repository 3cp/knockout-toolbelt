module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');
  grunt.initConfig({
    pkg: pkg,
    jshint: {
      all: ['src/knockout-toolbelt.js'],
      options: {
        globals: {
          module: true,
          require: true,
          define: true
        },

        // Restrictions
        curly: true,
        eqeqeq: true,
        indent: 2,
        latedef: true,
        newcap: true,
        noempty: true,
        undef: true,
        unused: true,
        strict: true,
        trailing: true,

        // Allowances
        validthis: true,

        // Environments
        browser: true,
      }
    },
    concat: {
      options: {
        process: function(src) {
          return src.replace('@@version@@', pkg.version);
        }
      },
      dist: {
        src: ['src/knockout-toolbelt.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        preserveComments: 'some'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jasmine_node: {
      options: {
        specNameMatcher: "\\.spec",
        projectRoot: ".",
        requirejs: false,
        useHelpers: true,
        forceExit: true
      },
      all: ['spec/']
    },
    watch: {
      scripts: {
        files: ['src/*.js', 'spec/*.js'],
        tasks: ['default'],
        options: { nospawn: false }
      },
    },
    docco: {
      debug: {
        src: ['dist/knockout-toolbelt.js'],
        options: {
          output: 'docs/'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-docco');

  grunt.registerTask('test', ['jshint', 'jasmine_node']);
  grunt.registerTask('build', ['concat', 'uglify', 'docco']);
  grunt.registerTask('default', ['test', 'build']);
};
