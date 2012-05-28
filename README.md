# JQ [![Build Status](https://secure.travis-ci.org/arumons/JQ.png?branch=master)](http://travis-ci.org/arumons/JQ)

JQ is a DSL for querying javascript object. APIs are very similar to jQuery. If you know jQuery, you can use this library immediately.

## Installation

via npm:

```bash
$ npm install JQ
```

## Browser Support

To compile JQ to a single file runnable for client-side use simply execute:

```bash
$ make JQ.js
```

## Example

```
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

## Documentation

### JQ(object), JQ(string)

Produces a selector object which take condition expression.
JQ take a javascript object or string which can be parsed as JSON.

```
var JQ = require('JQ').JQ;
var people = {
  [
    {
      name: 'john'
    },
    {
      name: 'bob'
    }
  ]
};
var $people = JQ(people);
// or
var $people = JQ('{ [ { "name": "john" }, { "name": "bob" } ] }');
```

### (selector object)(condition)

Accepts a conditional expression to filtering object.
In a conditional expression, you can use operators below.

 * .(member)
 * \[\](member)
 * !
 * ~
 * +
 * -
 * typeof
 * *
 * /
 * %
 * +
 * -
 * <<
 * >>
 * >>>
 * <
 * <=
 * >
 * >=
 * in
 * instanceof
 * ==
 * !=
 * ===
 * !==
 * =~ (JQ original!)
 * !~ (JQ original!)
 * &
 * ^
 * |
 * &&
 * ||
 * ?:

Detail of each operators is on MDN(https://developer.mozilla.org/en/JavaScript/Reference/Operators/Operator_Precedence), but [=~], [!~] operators are JQ original. these are inspired by perl and ruby.
You can use these operators for regex matching.
If you want to change operators precedence, you can use a parenthesis of course.

```
var messages = [
  {
    speaker: 'bob',
    message: 'hello'
  },
  {
    speaker: 'john',
    message: 'hello'
  },
  {
    speaker: 'bob',
    message: 'good bye'
  },
  {
    speaker: 'bob',
    message: 'see you again'
  }
];

var $messages = JQ(messages);
$messages('speaker === "bob" && ( message === "hello" || message === "good bye")');

```

### baseObject

Return a object which is passed to JQ first.

```
var obj = { name: "bob", age: 18};
$obj = JQ(obj);
$obj.baseObject === obj // -> true
```

### size

Return the number of elements in JQ object.

```
var people = [{ name: "bob" }, { name: "jack" }, { name: "alice" }];
var $people = JQ(people);
$people.size() // -> 1
$people('name === "bob" || name === "alice"').size() // -> 2
```

### get 

Get the js objects matched by the JQ object.

```
var people = [{ name: "bob" }, { name: "jack" }, { name: "alice" }];
var $people = JQ(people);
$people('name === "bob" || name === "alice"').get() //-> [{ name: "bob" }, { name: "alice" }]
$people('name === "bob" || name === "alice"').get(0) //-> { name: "bob" }
$people('name === "bob" || name === "alice"').get(1) //-> { name: "alice" }
```

### eq

### empty

### prop

### remove

### removeProp

### each

### map
