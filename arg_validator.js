
(function(){
  'use strict';

  module.exports = createValidator;

  function createValidator(){
    var errors = [];
    var validator = function required(argName, argValue){
      if(arguments.length != 2){
        throw 'argument should have both argName and argValue.';
      }

      var validation = new Validation(argName, argValue, errors);
      validation.isExist();

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
        if(callback) callback(errors);
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
      this.errors.push([this.argName, 'does not exist']);
  });

  Validation.prototype.isString = createValidation(isStringValidation);
  function isStringValidation(){
    this._isTypeOf('string');
  }

  Validation.prototype.isNumber = createValidation(function(){
    this._isTypeOf('number');
  });

  Validation.prototype.isBoolean = createValidation(function(){
    this._isTypeOf('boolean');
  });

  Validation.prototype.isFunction = createValidation(function(){
    this._isTypeOf('function');
  });

  Validation.prototype.isObject = createValidation(function(){
    this._isTypeOf('object');
  });

  Validation.prototype._isTypeOf = createValidation(function(typeName){
    if(typeof this.argValue !== typeName)
      this.errors.push([this.argName, 'is not type of ' + typeName]);
  });

  Validation.prototype.isArray = createValidation(function(){
    this._isInstanceOf(Array);
  });

  var OBJECT_NAME_REG = /function (\w+)\(.+/;
  Validation.prototype._isInstanceOf = createValidation(function(object){
    if(!(this.argValue instanceof object)){
      var objectName = object.toString().match(OBJECT_NAME_REG)[1];
      if(!objectName) objectName = 'unknown object';
      this.errors.push([this.argName, 'is not instance of ' + objectName]);
    }
  });

  Validation.prototype.hasProperty = createValidation(function(){
    for(var pi = 0; pi < arguments.length; pi++){
      var propertyName = arguments[pi];
      if(this.argValue[propertyName] === undefined)
        this.errors.push([this.argName, 'does not have property ['+propertyName+']']);
    }
  });

  var stringValidator = require('validator');

  Validation.prototype.isURL = createValidation(isStringValidation, function(requireProtocol){
    requireProtocol = requireProtocol || false;

    if(!stringValidator.isURL(this.argValue, {require_protocol: requireProtocol}))
      this.errors.push([this.argName, 'is not an URL']);
  });

  Validation.prototype.isStringIn = createValidation(isStringValidation, function(){
    var values = Array.prototype.slice.call(arguments);
    if(!stringValidator.isIn(this.argValue, values))
      this.errors.push([this.argName, 'is not in [' + values + ']']);
  });

  function createValidation(){
    var validationFuncs = arguments;
    return function(){
      for(var vi = 0; vi < validationFuncs.length; vi++){
        var validationFunc = validationFuncs[vi];
        if(!this.skip){
          var previousErrorsLength = this.errors.length;
          validationFunc.apply(this, arguments);
          if(previousErrorsLength !== this.errors.length)
            this.skipValidation(true);
        }
      }
      return this;
    };
  }

})();
