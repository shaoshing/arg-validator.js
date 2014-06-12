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
      test.equal(arg.errors.length, 0);
      arg('Number 2', 'not a number').isNumber();
      test.equal(arg.errors.length, 1);
      arg('Number 3', true).isNumber();
      test.equal(arg.errors.length, 2);

      test.done();
    },

    testIsBoolean: function(test){
      var arg = argValidator();

      arg('Boolean 1', true).isBoolean();
      test.equal(arg.errors.length, 0);
      arg('Boolean 2', 'not a boolean').isBoolean();
      test.equal(arg.errors.length, 1);
      arg('Boolean 3', 1).isBoolean();
      test.equal(arg.errors.length, 2);

      test.done();
    },
  };
})();
