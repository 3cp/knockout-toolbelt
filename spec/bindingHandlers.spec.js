/* global define */
/* global describe */
/* global beforeEach */
/* global afterEach */
/* global it */
/* global expect */
/* global jasmine */

define(['knockout', 'jquery', 'jqueryui', 'jquery.fileupload', '/base/src/knockout-toolbelt.js'], function(ko, $) {
  'use strict';
  // only runs in SpecRunner.html
  // ignored in grunt test

  describe("jQueryui datepicker", function () {
    beforeEach(function() {
      $('<div id="testNode"></div>').appendTo('body');
    });

    afterEach(function() {
      ko.cleanNode($('#testNode')[0]);
      $('#testNode').remove();
      $('#ui-datepicker-div').remove();
    });

    it("bind date object to an input", function() {
      var d = ko.observable();
      var node = $('<input data-bind="datepicker: d, datepickerOptions: { dateFormat: \'yy-mm-dd\' }">').appendTo('#testNode');
      ko.applyBindings({d: d}, $('#testNode')[0]);
      expect(node.val()).toBe('');
      d(new Date(2014, 2, 5));
      expect(node.val()).toBe('2014-03-05');
      node.datepicker("setDate", new Date(2013, 7, 9)).trigger("change");
      expect(d()).toEqual(new Date(2013, 7, 9));
      node.val('2014-08-09').trigger("change");
      expect(d()).toEqual(new Date(2014, 7, 9));
    });
  });

  describe("jQuery fileupload", function () {
    beforeEach(function() {
      jasmine.Ajax.install();
      $('<div id="testNode"></div>').appendTo('body');
    });

    afterEach(function() {
      ko.cleanNode($('#testNode')[0]);
      $('#testNode').remove();
      jasmine.Ajax.uninstall();
    });

    it("bind fileupload to input type=file", function(done) {
      var url = '/testupload';
      var doneFn = jasmine.createSpy("success");
      var failFn = jasmine.createSpy("failure");
      var node = $('<input type="file" data-bind="fileupload: {url: url, dataType: \'json\', done: done, fail: fail}">').appendTo('#testNode');
      ko.applyBindings({url: url, done: function(e,d) {doneFn(d.result);}, fail: function(e,d) {failFn(d.result);} }, $('#testNode')[0]);

      setTimeout(function() {
        node.fileupload('send', {files: ['./SpecRunner.html']});
        expect(jasmine.Ajax.requests.mostRecent().url).toBe(url);
        expect(doneFn).not.toHaveBeenCalled();
        expect(failFn).not.toHaveBeenCalled();

        jasmine.Ajax.requests.mostRecent().response({
          "status": 200,
          "contentType": "application/json",
          "responseText": '{"file":1}'
        });

        expect(failFn).not.toHaveBeenCalled();
        expect(doneFn).toHaveBeenCalledWith({file: 1});
        done();
      }, 0);

    });
  });


});
