
(function(){
  'use strict';

  module.exports = createValidator;
  createValidator.addValidation = addValidation;

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
      if(argValue === undefined || argValue === null) validation._skipValidation(true);

      return validation;
    };

    validator.throwsOnError = function(){
      if(errors.length !== 0){
        throw makeError(errors);
      }
    };

    validator.callsOnError = function(callback){
      if(errors.length !== 0){
        if(callback) callback(makeError(errors));
        return true;
      }
      return false;
    };

    validator.addError = function(argName, message){
      errors.push([argName, message]);
    };

    function makeError(errors){
      var message = "ArgValidator: ";
      for(var ei = 0; ei < errors.length; ei++){
        message += errors[ei].join(' ') + '. ';
      }
      var err = new Error(message);
      err.errors = errors;
      return err;
    }

    return validator;
  }

  function Validation(argName, argValue, errors){
    this.argName = argName;
    this.argValue = argValue;
    this.errors = errors;
    this.skip = false;
  }

  Validation.prototype._skipValidation = function(yes){
    this.skip = yes;
  };

  Validation.prototype.addError = function(argName, message){
    this.errors.push([argName, message]);
  };

  //////////////////////////////////////////////////////
  //    Begin of Validation Rules                     //
  //////////////////////////////////////////////////////

  addValidation('isExist', function(){
    if(this.argValue === undefined || this.argValue === null)
      this.addError(this.argName, 'does not exist');
  });

  addValidation('isString',isStringValidation);
  function isStringValidation(){
    this._isTypeOf('string');
  }

  addValidation('isNumber', function(){
    this._isTypeOf('number');
  });

  addValidation('isBoolean', function(){
    this._isTypeOf('boolean');
  });

  addValidation('isFunction', function(){
    this._isTypeOf('function');
  });

  addValidation('isObject', function(){
    this._isTypeOf('object');
  });

  addValidation('_isTypeOf', function(typeName){
    if(typeof this.argValue !== typeName)
      this.addError(this.argName, 'is not type of ' + typeName);
  });

  addValidation('isArray', function(){
    this._isInstanceOf(Array);
  });

  var OBJECT_NAME_REG = /function (\w+)\(.+/;
  addValidation('_isInstanceOf', function(object){
    if(!(this.argValue instanceof object)){
      var objectName = object.toString().match(OBJECT_NAME_REG)[1];
      if(!objectName) objectName = 'unknown object';
      this.addError(this.argName, 'is not instance of ' + objectName);
    }
  });

  addValidation('hasProperty', function(){
    for(var pi = 0; pi < arguments.length; pi++){
      var propertyName = arguments[pi];
      if(this.argValue[propertyName] === undefined)
        this.addError(this.argName, 'does not have property ['+propertyName+']');
    }
  });

  var stringValidator = require('validator');

  addValidation('isURL', isStringValidation, function(requireProtocol){
    requireProtocol = requireProtocol || false;

    if(!stringValidator.isURL(this.argValue, {require_protocol: requireProtocol}))
      this.addError(this.argName, 'is not an URL');
  });

  addValidation('isStringIn', isStringValidation, function(){
    var values = Array.prototype.slice.call(arguments);
    if(!stringValidator.isIn(this.argValue, values))
      this.addError(this.argName, 'is not in [' + values + ']');
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
            this._skipValidation(true);
        }
      }
      return this;
    };
  }

  function addValidation(){
    var name = arguments[0];
    if(Validation.prototype[name])
      throw new Error('ArgValidator: validation [' + name + '] already exists.');
    var funcs = Array.prototype.slice.call(arguments, 1);
    Validation.prototype[name] = createValidation.apply(null, funcs);
  }
})();
