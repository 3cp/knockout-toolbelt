(function() {
  var ko = this.ko || require('../src/knockout-toolbelt.js');

  describe("Extender 'numeric'", function () {

    it("limit number to integer.", function() {
      var num = ko.observable().extend({numeric: 0})

      expect(ko.isObservable(num)).toBe(true);
      expect(num()).toBe(0);
      num(-2.93);
      expect(num()).toBe(-3);
      num("abc")
      expect(num()).toBe(0);
      num("23.00001");
      expect(num()).toBe(23);
      num("4935ios");
      expect(num()).toBe(0);
    });

    it("limit number to certain precision.", function() {
      var num = ko.observable().extend({numeric: 2})

      expect(ko.isObservable(num)).toBe(true);
      expect(num()).toBe(0);
      num(-2.9353);
      expect(num()).toBe(-2.94);
      num("abc")
      expect(num()).toBe(0);
      num("23.011");
      expect(num()).toBe(23.01);
      num("4935ios");
      expect(num()).toBe(0);
    });

  });

  describe("Extender 'numericRange'", function() {

    it("limit numeric range", function() {
      var num = ko.observable().extend({numericRange: { min: 2, max: 8 }});

      expect(ko.isObservable(num)).toBe(true);
      expect(num()).toBe(2);
      num(7.99);
      expect(num()).toBe(7.99);
      num(2.01);
      expect(num()).toBe(2.01);
      num(8.01);
      expect(num()).toBe(8);
      num(1.99);
      expect(num()).toBe(2);
    });

    it("limit numeric min", function() {
      var num = ko.observable().extend({numericRange: { min: 2 }});

      expect(ko.isObservable(num)).toBe(true);
      expect(num()).toBe(2);
      num(2.01);
      expect(num()).toBe(2.01);
      num(1.99);
      expect(num()).toBe(2);
      num(Infinity);
      expect(num()).toBe(Infinity);
    });

    it("limit numeric max", function() {
      var num = ko.observable().extend({numericRange: { max: 2 }});

      expect(ko.isObservable(num)).toBe(true);
      expect(num()).toBe(-Infinity);
      num(2.01);
      expect(num()).toBe(2);
      num(1.99);
      expect(num()).toBe(1.99);
      num(Infinity);
      expect(num()).toBe(2);
      num(-Infinity);
      expect(num()).toBe(-Infinity);
    });

    it("init undefined value to min", function() {
      var t = ko.observable().extend({numericRange: {}});
      expect(t()).toBe(-Infinity);
      t = ko.observable().extend({numericRange: {max: 2}});
      expect(t()).toBe(-Infinity);
      t = ko.observable().extend({numericRange: {min: -20}});
      expect(t()).toBe(-20);
      t = ko.observable().extend({numericRange: {min: 20}});
      expect(t()).toBe(20);
      t = ko.observable().extend({numericRange: {min: 20, max: 21}});
      expect(t()).toBe(20);

      // min cannot be greater than max
      expect(function() { ko.observable().extend({numericRange: {min: 2, max: 1}}); }).toThrow();
    });

  });

  describe("Extender 'trim'", function() {

    it("trim string", function() {
      var trim = ko.observable("  init ").extend({trim: true});

      expect(ko.isObservable(trim)).toBe(true);
      expect(trim()).toBe("init");
      trim("   ");
      expect(trim()).toBe("");
      trim(" \t  leading");
      expect(trim()).toBe("leading");
      trim("trailing  \t ");
      expect(trim()).toBe("trailing");
      trim("   \t rounded string  \t ");
      expect(trim()).toBe("rounded string");
    });
  });

  describe("Extender 'uppercase'", function() {

    it("uppercase string", function() {
      var trim = ko.observable("  init ").extend({uppercase: true});

      expect(ko.isObservable(trim)).toBe(true);
      expect(trim()).toBe("  INIT ");
      trim(" \t  leading");
      expect(trim()).toBe(" \t  LEADING");
    });
  });

  describe("Extender 'lowercase'", function() {

    it("lowercase string", function() {
      var trim = ko.observable("  INIT ").extend({lowercase: true});

      expect(ko.isObservable(trim)).toBe(true);
      expect(trim()).toBe("  init ");
      trim(" \t  LEADING");
      expect(trim()).toBe(" \t  leading");
    });
  });

  describe("Mix 'trim', 'uppercase', 'lowercase'", function() {

    it("trim uppercase string", function() {
      var trim = ko.observable("  init ").extend({trim: true, uppercase: true});

      expect(ko.isObservable(trim)).toBe(true);
      expect(trim()).toBe("INIT");
      trim(" \t  leading");
      expect(trim()).toBe("LEADING");
    });

    it("trim lowercase string", function() {
      var trim = ko.observable("  INIT ").extend({trim: true, lowercase: true});

      expect(ko.isObservable(trim)).toBe(true);
      expect(trim()).toBe("init");
      trim(" \t  LEADING");
      expect(trim()).toBe("leading");
    });
  });


})(this);
