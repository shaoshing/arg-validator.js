
(function(){
  'use strict';

  module.exports = createValidator;

  function createValidator(){
    var errors = [];
    var validator = function (argName, argValue){
      var validations = new Validation(argName, argValue, errors);

      var previousErrorsLength = errors.length;
      validations.isExist();
      if(previousErrorsLength !== errors.length){
        validations.skipValidation(true);
      }

      return validations;
    };

    validator.errors = errors;

    validator.throwOnError = function(){
      if(errors.length !== 0){
        throw "Error!";
      }
    };

    validator.callOnError = function(callback){
      if(errors.length !== 0){
        callback(errors);
      }
    };

    return validator;
  }

  function Validation(argName, argValue, errors){
    this.argName = argName;
    this.argValue = argValue;
    this.errors = errors;
    this.skip = false;
  }

  Validation.prototype.skipValidation = function(yes){
    this.skip = yes;
  };

  Validation.prototype.isExist = function(){
    if(!this.skip){
      if(this.argValue === undefined || this.argValue === null){
        this.errors.push([this.argName, 'should exist']);
      }
    }
    return this;
  };

})();
