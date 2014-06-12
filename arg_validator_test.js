(function(){
  'use strict';

  var argValidator = require('./arg_validator');

  exports.group = {
    testInitialization: function(test){
      var arg = argValidator();
      test.equal(arg.errors.length, 0);

      var validation;
      validation = arg('Arg1', true);
      test.equal(arg.errors.length, 0);
      test.equal(validation.skip, false);

      // when the passed in argument is undefined or null, it should mark the
      // Validation#skip to true to skip all upcoming chained validations.
      validation = arg('Arg2', undefined);
      test.equal(arg.errors.length, 1);
      test.equal(validation.skip, true);
      validation = arg('Arg3', null);
      test.equal(arg.errors.length, 2);
      test.equal(validation.skip, true);

      test.done();
    },

    testOptionalArg: function(test){
      var arg = argValidator();
      arg.optional('name', null).isString();
      test.equal(arg.errors.length, 0);
      test.done();
    },

    testOnError: function(test){
      var arg = argValidator();
      test.equal(arg.errors.length, 0);
      test.doesNotThrow(function(){ arg.throwsOnError(); });
      var called = arg.callsOnError(function(){ test.ok(false, 'Should not call the block when there has no error'); });
      test.ok(!called);

      arg('String', false).isString();
      test.equal(arg.errors.length, 1);
      test.throws(function(){ arg.throwsOnError(); });
      var callbackCalled = false
      called = arg.callsOnError(function(){ callbackCalled = true; });
      test.ok(called);
      test.ok(callbackCalled);

      test.done();
    },

    testIsString: function(test){
      var arg = argValidator();

      arg('String 1', "This is a string").isString();
      test.equal(arg.errors.length, 0);
      arg('String 2', 1).isString();
      test.equal(arg.errors.length, 1);
      arg('String 3', false).isString();
      test.equal(arg.errors.length, 2);

      test.done();
    },

    testIsNumber: function(test){
      var arg = argValidator();

      arg('Number 1', 1).isNumber();
      test.equal(arg.errors.length, 0, arg.errors);
      arg('Number 2', 'not a number').isNumber();
      test.equal(arg.errors.length, 1, arg.errors);
      arg('Number 3', true).isNumber();
      test.equal(arg.errors.length, 2, arg.errors);

      test.done();
    },

    testIsBoolean: function(test){
      var arg = argValidator();

      arg('Boolean 1', true).isBoolean();
      test.equal(arg.errors.length, 0, arg.errors);
      arg('Boolean 2', 'not a boolean').isBoolean();
      test.equal(arg.errors.length, 1, arg.errors);
      arg('Boolean 3', 1).isBoolean();
      test.equal(arg.errors.length, 2, arg.errors);

      test.done();
    },

    testHasProperty: function(test){
      var arg = argValidator();
      arg('Hash', {a: 1, b: 2, c: 3}).hasProperty('a', 'b', 'c');
      test.equal(arg.errors.length, 0, arg.errors);

      arg = argValidator();
      arg('Hash', {a: 1, b: 2}).hasProperty('a', 'b', 'c');
      test.equal(arg.errors.length, 1, arg.errors);

      arg = argValidator();
      arg('Hash', {}).hasProperty('a', 'b', 'c');
      test.equal(arg.errors.length, 3, arg.errors);

      test.done();
    }
  };
})();
