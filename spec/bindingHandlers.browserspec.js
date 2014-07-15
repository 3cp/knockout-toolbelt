(function() {
  var $ = this.$ || require('jquery');
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    // Node.js
    require('jquery-ui');
  }
  var ko = this.ko || require('../src/knockout-toolbelt.js');


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
      $('#testNode input').datepicker("setDate", new Date(2013, 7, 9)).trigger("change");
      expect(d()).toEqual(new Date(2013, 7, 9));
      $('#testNode input').val('2014-08-09').trigger("change");
      expect(d()).toEqual(new Date(2014, 7, 9));
    });
  });


})(this);
