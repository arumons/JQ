var should = require('should');
var parser = require('./parser');

describe('evalCondition', function() {

  it('test member(.) operator', function() {
    var obj = {a: {b: {c: 3}}};
    var code = "a.b.c";
    parser.evalCondition(obj, code).should.be.eql(3);

    var code = "this.a.b.c";
    parser.evalCondition(obj, code).should.be.eql(3);
  });

  it('test member([]) operator', function() {
    var obj = {a: {b: {c: 3}}};
    var code = "a['b']['c']";
    parser.evalCondition(obj, code).should.be.eql(3);

    var code = "this['a']['b']['c']";
    parser.evalCondition(obj, code).should.be.eql(3);
  });

  it('test logical not operator', function() {
    var obj = {"a": false, "b": true};
    var code = "!a";
    parser.evalCondition(obj, code).should.be.true;

    var code = "!b";
    parser.evalCondition(obj, code).should.be.false;
  });

  it('test bitwise not operator', function() {
    var obj = {a: 1, b: -2};
    var code = "~a";
    parser.evalCondition(obj, code).should.be.eql(-2);
    
    var code = "~b";
    parser.evalCondition(obj, code).should.be.eql(1);
  });

  it('test unary + operator', function() {
    var obj = {a: 1};
    var code = "+a";
    parser.evalCondition(obj, code).should.be.eql(1);
  });

  it('test unary - operator', function() {
    var obj = {a: 1};
    var code = "-a";
    parser.evalCondition(obj, code).should.be.eql(-1);
  });

  it('test typeof operator', function() {
    var obj = {a: 1, b: "foo"};
    var code = "typeof a";
    parser.evalCondition(obj, code).should.be.eql('number');

    var code = "typeof b";
    parser.evalCondition(obj, code).should.be.eql('string');
  });

  it('test multiplication operator', function() {
    var obj = {a: 3};
    var code = "a * a";
    parser.evalCondition(obj, code).should.be.eql(9);

    var code = "10 * a";
    parser.evalCondition(obj, code).should.be.eql(30);
  });

  it('test division operator', function() {
    var obj = {a: 9};
    var code = "a / 3";
    parser.evalCondition(obj, code).should.be.eql(3);
  });

  it('test modulus operator', function() {
    var obj = {a: 10};
    var code = "a % 3";
    parser.evalCondition(obj, code).should.be.eql(1);
  });

  it('test addition operator', function() {
    var obj = {a: 10};
    var code = "a + 10 + 3";
    parser.evalCondition(obj, code).should.be.eql(23);
  });

  it('test subtraction operator', function() {
    var obj = {a: 10};
    var code = "a - 5";
    parser.evalCondition(obj, code).should.be.eql(5);
  });

  it('test bitwise shift(<<) operator', function() {
    var obj = {a: 1};
    var code = "a << 2";
    parser.evalCondition(obj, code).should.be.eql(4);
  });

  it('test bitwise shift(>>) operator', function() {
    var obj = {a: 4};
    var code = "a >> 2";
    parser.evalCondition(obj, code).should.be.eql(1);
  });

  it('test bitwise shift(>>>) operator', function() {
    var obj = {a: 4};
    var code = "a >>> 2";
    parser.evalCondition(obj, code).should.be.eql(1);
  });

  it('test relational(<) operator', function() {
    var obj = {a: 10};
    var code = "a < 11";
    parser.evalCondition(obj, code).should.be.true;
  });

  it('test relational(<=) operator', function() {
    var obj = {a: 10};
    var code = "a <= 10";
    parser.evalCondition(obj, code).should.be.true;
  });

  it('test relational(>) operator', function() {
    var obj = {a: 10};
    var code = "a > 9";
    parser.evalCondition(obj, code).should.be.true;
  });

  it('test relational(>=) operator', function() {
    var obj = {a: 10};
    var code = "a >= 10";
    parser.evalCondition(obj, code).should.be.true;
  });

  it('test in operator', function() {
    var obj = {a: 10};
    var code = "'a' in this";
    parser.evalCondition(obj, code).should.be.true;

    var code = "'b' in this";
    parser.evalCondition(obj, code).should.be.false;
  });

  it('test instanceof operator', function() {
    var obj = {a: new String(), b: new Date()};
    var code = "a instanceof global.String";
    parser.evalCondition(obj, code).should.be.true;

    var code = "'b' instanceof global.String";
    parser.evalCondition(obj, code).should.be.false;
  });

  it('test equality(==) operator', function() {
    var obj = {a: 1};
    var code = "a == 1";
    parser.evalCondition(obj, code).should.be.true;

    var code = "a == '1'";
    parser.evalCondition(obj, code).should.be.true;
  });

  it('test equality(!=) operator', function() {
    var obj = {a: 1};
    var code = "a != 1";
    parser.evalCondition(obj, code).should.be.false;

    var code = "a != '1'";
    parser.evalCondition(obj, code).should.be.false;
  });

  it('test equality(===) operator', function() {
    var obj = {a: 1};
    var code = "a === 1";
    parser.evalCondition(obj, code).should.be.true;

    var code = "a === '1'";
    parser.evalCondition(obj, code).should.be.false;
  });

  it('test equality(!==) operator', function() {
    var obj = {a: 1};
    var code = "a !== 1";
    parser.evalCondition(obj, code).should.be.false;

    var code = "a !== '1'";
    parser.evalCondition(obj, code).should.be.true;
  });

  it('test bitwise-and operator', function() {
    var obj = {a: 3};
    var code = "a & 1";
    parser.evalCondition(obj, code).should.be.eql(1);

    var code = "a & 2";
    parser.evalCondition(obj, code).should.be.eql(2);
  });

  it('test bitwise-xor operator', function() {
    var obj = {a: 3};
    var code = "a ^ 3";
    parser.evalCondition(obj, code).should.be.eql(0);

    var code = "a ^ 4";
    parser.evalCondition(obj, code).should.be.eql(7);
  });

  it('test bitwise-or operator', function() {
    var obj = {a: 3};
    var code = "a | 1";
    parser.evalCondition(obj, code).should.be.eql(3);

    var code = "a | 2";
    parser.evalCondition(obj, code).should.be.eql(3);
  });

  it('test bitwise-and operator', function() {
    var obj = {a: 3, b: 10};
    var code = "a === 3 && b === 10";
    parser.evalCondition(obj, code).should.be.true;

    var code = "a === 4 && b === 10";
    parser.evalCondition(obj, code).should.be.false;
  });

  it('test bitwise-or operator', function() {
    var obj = {a: 3, b: 10};
    var code = "a === 0 || b === 10";
    parser.evalCondition(obj, code).should.be.true;

    var code = "a === 0 || b === 99";
    parser.evalCondition(obj, code).should.be.false;
  });

  it('test conditional operator', function() {
    var obj = {a: 3, b: 10};
    var code = "a === 3 ? a : b";
    parser.evalCondition(obj, code).should.be.eql(3);

    var code = "a !== 3 ? a : b";
    parser.evalCondition(obj, code).should.be.eql(10);
  });

  it('test parenthesis', function() {
    var obj = {a: 3, b: 9};
    var code = "a + b * 10";
    parser.evalCondition(obj, code).should.be.eql(93);

    var code = "(a + b) * 10";
    parser.evalCondition(obj, code).should.be.eql(120);
  });
});

