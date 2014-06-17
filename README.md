
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
makeHttpRequest('abc', 'AMEND', 12); // Exception,
                                     //   [
                                     //     "url is not an url",
                                     //     "action is not in [GET, POST, PUT, DELETE]",
                                     //     "params is not an object"
                                     //   ]
```

## Asynchronous Example

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
  console.log(error); // => ["action is not in [GET, POST, PUT, DELETE]"]
});

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
