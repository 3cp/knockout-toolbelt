var allTestFiles = [];
var TEST_REGEXP = /spec\/.+\.(spec|test)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  // dynamically load all test files
  deps: allTestFiles,

  paths: {
    jquery: "bower_components/jquery/dist/jquery",
    "jquery.postmessage-transport": "bower_components/jquery-file-upload/js/cors/jquery.postmessage-transport",
    "jquery.xdr-transport": "bower_components/jquery-file-upload/js/cors/jquery.xdr-transport",
    "jquery.ui.widget": "bower_components/jquery-file-upload/js/vendor/jquery.ui.widget",
    "jquery.fileupload": "bower_components/jquery-file-upload/js/jquery.fileupload",
    "jquery.fileupload-process": "bower_components/jquery-file-upload/js/jquery.fileupload-process",
    "jquery.fileupload-validate": "bower_components/jquery-file-upload/js/jquery.fileupload-validate",
    "jquery.fileupload-image": "bower_components/jquery-file-upload/js/jquery.fileupload-image",
    "jquery.fileupload-audio": "bower_components/jquery-file-upload/js/jquery.fileupload-audio",
    "jquery.fileupload-video": "bower_components/jquery-file-upload/js/jquery.fileupload-video",
    "jquery.fileupload-ui": "bower_components/jquery-file-upload/js/jquery.fileupload-ui",
    "jquery.fileupload-jquery-ui": "bower_components/jquery-file-upload/js/jquery.fileupload-jquery-ui",
    "jquery.fileupload-angular": "bower_components/jquery-file-upload/js/jquery.fileupload-angular",
    "jquery.iframe-transport": "bower_components/jquery-file-upload/js/jquery.iframe-transport",
    jqueryui: "bower_components/jqueryui/jquery-ui",
    underscore: "bower_components/underscore/underscore",
    "underscore.string": "bower_components/underscore.string/lib/underscore.string",
    knockout: "bower_components/knockout/dist/knockout"
  },

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
