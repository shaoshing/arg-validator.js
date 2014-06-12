
(function(){
  'use strict';

  module.exports = createValidator;

  function createValidator(){
    var errors = [];
    var validator = function required(argName, argValue){
      var validation = new Validation(argName, argValue, errors);

      var previousErrorsLength = errors.length;
      validation.isExist();
      if(previousErrorsLength !== errors.length)
        validation.skipValidation(true);

      return validation;
    };

    validator.errors = errors;

    validator.optional = function(argName, argValue){
      var validation = new Validation(argName, argValue, errors);
      if(argValue === undefined || argValue === null) validation.skipValidation(true);

      return validation;
    };

    validator.throwsOnError = function(){
      if(errors.length !== 0){
        throw errors;
      }
    };

    validator.callsOnError = function(callback){
      if(errors.length !== 0){
        callback(errors);
        return true;
      }
      return false;
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

  //////////////////////////////////////////////////////
  //    Begin of Validation Rules                     //
  //////////////////////////////////////////////////////

  Validation.prototype.isExist = createValidation(function(){
    if(this.argValue === undefined || this.argValue === null)
      this.errors.push([this.argName, 'should exist']);
  });

  Validation.prototype.isString = createValidation(function(){
    if(typeof this.argValue !== 'string')
      this.errors.push([this.argName, 'is not a string']);
  });

  Validation.prototype.isNumber = createValidation(function(){
    if(typeof this.argValue !== 'number')
      this.errors.push([this.argName, 'is not a number']);
  });

  Validation.prototype.isBoolean = createValidation(function(){
    if(typeof this.argValue !== 'boolean')
      this.errors.push([this.argName, 'is not a boolean']);
  });

  Validation.prototype.hasProperty = createValidation(function(){
    for(var pi = 0; pi < arguments.length; pi++){
      var propertyName = arguments[pi];
      if(this.argValue[propertyName] === undefined)
        this.errors.push([this.argName, 'does not have property ['+propertyName+']']);
    }
  });

  function createValidation(validationFunc){
    return function(){
      if(!this.skip){
        validationFunc.apply(this, arguments);
      }
      return this;
    };
  }

})();
