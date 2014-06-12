(function(){
  'use strict';

  var argValidator = require('./arg_validator');

  exports.testInitialization = function(test){
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
  };
})();
