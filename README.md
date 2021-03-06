
# arg-validator.js

A simpler way to do argument validations on functions.

[![NPM version](https://badge.fury.io/js/arg-validator.svg)](http://badge.fury.io/js/arg-validator) [![Build Status](https://travis-ci.org/shaoshing/arg-validator.js.svg?branch=master)](https://travis-ci.org/shaoshing/arg-validator.js)

## Install

```bash
npm install arg-validator --save
```

## Example

```js
var argValidator = require('arg-validator');

// required: name, age
// optional: address
function makeHttpRequest(url, action, params){
  var arg = argValidator();
  arg('url', url).isURL();
  arg('action', action).isStringIn('GET', 'POST', 'PUT', 'DELETE');
  arg.optional('params', params).isObject();
  arg.throwsOnError(); // or access the errors by arg.errors
}
```

Compare with the code without arg-validation.js

```js
function makeHttpRequest(url, action, params){
  if(some regexp validation of the url)
    throw "url must be an url";
  if(check if action is in ['GET', 'POST', 'PUT', 'DELETE'])
    throw "action must be in GET, POST, PUT, DELETE";
  if(params){
    if(typeof params != 'object')
      throw "params must be an object";
  }
}
```

And you get all the validation errors

```js
makeHttpRequest('abc', 'AMEND', 12); // ArgValidator: url is not an url. action is not
                                     // in [GET, POST, PUT, DELETE]. params is not an object.
```

### Asynchronous Example

```js
var argValidator = require('arg-validator');

// required: name, age
// optional: address
function makeHttpRequest(url, action, params, callback){
  var arg = argValidator();
  arg('url', url).isURL();
  arg('action', action).isStringIn('GET', 'POST', 'PUT', 'DELETE');
  arg('params', params).isObject();
  if(arg.callsOnError(callback)) return;
}

makeHttpRequest('google.com', 'AMEND', {}, function(error){
  console.log(error); // => ArgValidator: action is not in [GET, POST, PUT, DELETE]
                      //            :
                      //            :
                      //            :
                      //         [stack]
  console.log(error.message); // => 'ArgValidator: action is not in [GET, POST, PUT, DELETE]'
  console.log(error.errors);  // => [
                              //      ['action', 'is not in [GET, POST, PUT, DELETE']
                              //    ]
});

```

### Custom Validation

```js
function hello(world){
  var arg = argValidator();
  if(world !== 'world') arg.addError('world', 'must be "world".')
  arg.throwsOnError();
}

// Or you can add a custom validation rule by
argValidator.addValidation('isWorld', function(){
  if(this.argValue !== 'world')
    this.addError(this.argName, 'must be "world", but is "' + this.argValue + '"');
})

function hello(world){
  var arg = argValidator();
  arg('world', world).isWorld();
  arg.throwsOnError();
}

```

## List of Validations

- isExist // arg('a', a) is a shortcut to arg('a', a).isExist()
- isString
- isNumber
- isBoolean
- isFunction
- isObject
- isArray
- isURL
- isStringIn(values...)
- hasProperty(requireProtocol)

## License

MIT
