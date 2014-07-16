module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');
  grunt.initConfig({
    pkg: pkg,
    jshint: {
      all: ['src/knockout-toolbelt.js', 'spec/*spec.js'],
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
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        runnerPort: 9999,
        singleRun: true,
        browsers: ['PhantomJS'],
        logLevel: 'ERROR'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', ['jshint', 'karma']);
  grunt.registerTask('build', ['concat', 'uglify', 'docco']);
  grunt.registerTask('default', ['test', 'build']);
};
