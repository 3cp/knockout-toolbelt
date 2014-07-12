/*! Knockout toolbelt - version @@version@@ */

(function(global, undefined) {
  'use strict';

  function attachToKo(ko, $, _, _s) {

    function buildExtender(valueFilter) {
      return function(target, opts) {
        var result = ko.computed({
          read: target,
          write: function(newValue) {
            var current = target();
            var valueToWrite = valueFilter(newValue, opts);

            if (valueToWrite !== current) {
              target(valueToWrite);
            } else {
              if (newValue !== current) {
                target.notifySubscribers(valueToWrite);
              }
            }
          }
        });

        result(target());
        return result;
      };
    }

    // 'numeric', copied from http://knockoutjs.com/documentation/extenders.html
    // fixed initial undefined value isNaN(+newValue).
    ko.extenders.numeric = buildExtender(function(newValue, precision) {
      var roundingMultiplier = Math.pow(10, precision);
      var newValueAsNum = isNaN(+newValue) ? 0 : parseFloat(+newValue);
      return Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;
    });

    // 'numericRange', support max and min
    ko.extenders.numericRange = buildExtender(function(newValue, opts) {
      var min = opts.min || -Infinity;
      var max = opts.max || Infinity;

      if (min > max) {
        throw "Error: min (" + min + ") is greater than max (" + max + ")!";
      }

      var valueToWrite = parseFloat(+newValue);
      if (isNaN(valueToWrite) || min > valueToWrite) {
        valueToWrite = min;
      } else if (max < valueToWrite) {
        valueToWrite = max;
      }

      return valueToWrite;
    });

    // 'trim', trim string
    ko.extenders.trim = buildExtender(function(newValue) {
      return _s.trim(newValue);
    });

    ko.extenders.uppercase = buildExtender(function(newValue) {
      return newValue.toString().toUpperCase();
    });

    ko.extenders.lowercase = buildExtender(function(newValue) {
      return newValue.toString().toLowerCase();
    });

  }

  // Determines which module loading scenario we're in, grabs dependencies, and attaches to KO
  function prepareExports() {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
      // Node.js case - load KO synchronously
      var ko = require('knockout');
      var $ = require('jquery');
      var _ = require('underscore');
      var _s = require('underscore.string');
      attachToKo(ko, $, _, _s);
      module.exports = ko;
    } else if (typeof define === 'function' && define.amd) {
      define(['knockout', 'jquery', 'underscore', 'underscore.string'], attachToKo);
    } else if (global.ko && global.$ && global._ && global._.str) {
      // Non-module case - attach to the global instance
      attachToKo(global.ko, global.$, global._, global._.str);
    }
  }

  prepareExports();

})(this);