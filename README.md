
# arg-validator.js

A simpler way to do argument validations on functions.

## Example

```js
var argValidator = require('arg-validator');

// required: name, age
// optional: address
function hello(name, age, address){
  var arg = argValidator();
  arg('name', name).isString();
  arg('age', age).isNumber();
  arg.optional('address', address).isString();
  arg.throwsOnError();

  // now do some real business.
}

hello('Shaoshing', 12);             // correct
hello('Shaoshing', 12, 'New York'); // correct

hello('Shaoshing', '12'); // Boom!
hello(true, 12);          // Boom!
```

Compare with the code without arg-validation.js

```js
function hello(name, age, address){
  if(typeof name !== 'string') throw "name is not a string";
  if(typeof age !== 'number') throw "age is not a string";
  if(address){
    if(typeof address != 'string')
      throw "age is not a string";
  }
}
```

## Asynchronous Example

```js
var argValidator = require('arg-validator');

function helloAsync(name, callback){
  var arg = argValidator();
  arg('name', name).isString();
  if(arg.callsOnError(callback)) return;

  // now do some real business.
}

helloAsync('Shaoshing', func(err){
  // error will be the validation errors
})
```

## List of Validations

- isString
- isNumber
- isBoolean
- isURL
- isStringIn(values...)
- hasProperty(requireProtocol)

## License

MIT
