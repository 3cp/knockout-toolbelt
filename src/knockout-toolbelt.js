// Knockout toolbelt - version @@version@@

(function(global, undefined) {
  'use strict';

  function attachToKo(ko, $, _, _s) {

    // factory method for building extender
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
        }).extend({ notify: 'always' });

        result(target());
        return result;
      };
    }

    // Extenders
    // =========

    // numeric
    // -------
    // copied from [http://knockoutjs.com/documentation/extenders.html](http://knockoutjs.com/documentation/extenders.html)
    // (with fix of initial undefined value `isNaN(+newValue)`)
    //  - an integer `ko.observable().extend({numeric: 0})`
    //  - a float with 2 digital after decimal point (1.23) `ko.observable().extend({numeric: 2})`
    ko.extenders.numeric = buildExtender(function(newValue, precision) {
      var roundingMultiplier = Math.pow(10, precision);
      var newValueAsNum = isNaN(+newValue) ? 0 : parseFloat(+newValue);
      return Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;
    });

    // numericRange
    // ------------
    // support max and min
    //  - a float >= 2 `ko.observable().extend({numericRange: {min: 2}})`
    //  - a float <= 2 `ko.observable().extend({numericRange: {max: 2}})`
    //  - a float between 2 and 5 inclusive `ko.observable().extend({numericRange: {min: 2, max: 5}})`
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

    // trim
    // ----
    // trim string
    //  - `ko.observable().extend({trim: true})`
    ko.extenders.trim = buildExtender(function(newValue) {
      return _s.trim(newValue);
    });

    // uppercase
    // ---------
    // uppercase string
    //  - `ko.observable().extend({uppercase: true})`
    ko.extenders.uppercase = buildExtender(function(newValue) {
      return newValue.toString().toUpperCase();
    });

    // lowercase
    // ---------
    // lowercase string
    //  - `ko.observable().extend({lowercase: true})`
    ko.extenders.lowercase = buildExtender(function(newValue) {
      return newValue.toString().toLowerCase();
    });

    // bindingHandlers
    // ===============

    // jqueryui datepicker
    // -------------------
    // Only when jqueryui datepicker is available [http://api.jqueryui.com/datepicker/](http://api.jqueryui.com/datepicker/)
    if ($.fn && $.fn.datepicker) {
      // - `<input date-bind="datepicker: aDate, datepickerOptions: { dateFormat: 'yy-mm-dd' }">`
      ko.bindingHandlers.datepicker = {
        init: function (element, valueAccessor, allBindings) {
          // pass any valid datepicker options to `datepickerOptions`.
          var options = allBindings.get('datepickerOptions') || {};
          $(element).datepicker(options);

          $(element).on("change", function () {
            var observable = valueAccessor();
            observable($(element).datepicker("getDate"));
          });

          ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).datepicker("destroy");
          });
        },
        update: function(element, valueAccessor) {
          var v = ko.unwrap(valueAccessor());
          if (_.isDate(v)) {
            $(element).datepicker('setDate', v);
          } else {
            $(element).datepicker('setDate', null);
          }
        }
      };
    }

    // jquery fileupload
    // -----------------
    // Only when jquery fileupload is available [https://github.com/blueimp/jQuery-File-Upload](https://github.com/blueimp/jQuery-File-Upload)
    if ($.fn && $.fn.fileupload) {
      ko.bindingHandlers.fileupload = {
        init: function (element, valueAccessor) {
          var options = valueAccessor() || {};
          $(element).fileupload(options);

          ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
              $(element).fileupload("destroy");
          });
        }
      };
    }


  }

  // support various module systems
  function prepareExports() {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
      // Node.js
      var ko = require('knockout');
      var $ = require('jquery');
      var _ = require('underscore');
      var _s = require('underscore.string');
      attachToKo(ko, $, _, _s);
      module.exports = ko;
    } else if (typeof define === 'function' && define.amd) {
      // AMD (requireJS)
      define(['knockout', 'jquery', 'underscore', 'underscore.string'], attachToKo);
    } else if (global.ko && global.$ && global._ && global._.str) {
      // Non-module case - attach to the global instance
      attachToKo(global.ko, global.$, global._, global._.str);
    }
  }

  prepareExports();

})(this);
