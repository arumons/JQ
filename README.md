# JQ [![Build Status](https://secure.travis-ci.org/arumons/JQ.png?branch=master)](http://travis-ci.org/arumons/JQ)

JQ is a DSL for querying javascript object. APIs are very similar to jQuery. If you know jQuery, you can use this library immediately.

## Instalation

via npm:

```bash
$ npm install JQ
```

## Browser Support

To compile JQ to a single file runnable for client-side use simply execute:

```bash
$ make JQ.js
```

## Sample

```bash
var JQ = require('JQ').JQ;

var family = {
  father_name: 'bob',
  mother_name: 'kathy',
  children: [
    { 
      name: 'john',
      age: 3
    },
    {
      name: 'alice',
      age: 2
    },
    {
      name: 'mike',
      age: 1
    }
  ]
};

var $family = JQ(family);
$family("name === 'john' || age === 1").get(0); // -> { name: 'john', age: 3 }
$family("name === 'john' || age === 1").get(1); // -> { name: 'make', age: 1 }
$family("father_name === 'bob'").get(0).mother_name; // -> 'kathy'

```
