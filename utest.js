var jsp = require('uglify-js').parser;

var walk = function(obj, ast) {
  var op = getOp(ast);
  return op(obj);
};

var getOp = function(ast) {
   if (ast[0] === 'name') {
     return getValue;
   } else if (ast[0] === 'binary') {
     if (ast[1] === '===') {
       return strinctEqual;
     }
   }
};

var getValue = function(obj) {
  return obj[1];
};

var strictEqual = function(obj, left, right) {
  var lValue = walk(left);
  var rValue = walk(right);
  return lValue === rValue;
};

var opStack = [];

var makeOpStack = function(ast) {
  if (ast[0] === 'binary') {
    opStack.push([ast[0], ast[1]]);
    makeOpStack(ast[2]);
    makeOpStack(ast[3]);
  } else {
    opStack.push(ast);
  }
}



//var orig_code = "a && b || ['  a  '] && 'hoge'";
var orig_code = "(a + 3) === 4";
var ast = jsp.parse(orig_code);
makeOpStack(ast[1][0][1]);
console.log(opStack);





