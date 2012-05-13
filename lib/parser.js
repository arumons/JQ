var jsp = require('./parse-js.js');

var global = (function() { return this;})();

var isRegExp = function(obj) {
  return toString.call(obj) == '[object RegExp]';
};

exports.evalCondition = evalCondition = function(obj, code) {
  return compile(code)(obj);
};

exports.compile = compile = function(code) {
  var ast = jsp.parse(code);
  return function(obj) {
    var opStack = [];
    makeOpStack(opStack, ast[1][0][1]);
    return expr_eval(opStack, obj);
  };
};

var makeOpStack = function(opStack, ast) {
  var type = ast[0];
  if (type === 'conditional') {
   opStack.push(ast);
   makeOpStack(opStack, ast[1]);
   makeOpStack(opStack, ast[2]);
   makeOpStack(opStack, ast[3]);
  } else if (type === 'binary') {
    opStack.push(ast);
    makeOpStack(opStack, ast[2]);
    makeOpStack(opStack, ast[3]);
  } else if (type === 'unary-prefix') {
    opStack.push(ast);
    makeOpStack(opStack, ast[2]);
  } else if (type === 'dot') {
    opStack.push(ast);
    makeOpStack(opStack, ast[1]);
  } else if (type === 'sub') {
    opStack.push(ast);
    makeOpStack(opStack, ast[1]);
    makeOpStack(opStack, ast[2]);
  } else {
    opStack.push(ast);
  }
};

var expr_eval = function(opStack, obj) {
  var op = opStack.shift();
  var type = op[0];
  if (type === 'conditional') {
    var condition = expr_eval(opStack, obj);
    if (condition) {
      var result = expr_eval(opStack, obj);
      opStack.shift();
      return result;
    } else {
      opStack.shift();
      var result = expr_eval(opStack, obj);
      return result;
    }
  } else if (type === 'binary' && (op[1] == '&&' || op[1] === '||')) {
    var bOp = op[1];
    var lValue = expr_eval(opStack, obj);
    if  (bOp === '&&') {
      if (lValue) {
        var rValue = expr_eval(opStack, obj);
        return lValue && rValue;
      } else {
        opStack.shift();
        return lValue;
      }
    } else if (bOp === '||') {
      if (lValue) {
        opStack.shift();
        return lValue;
      } else {
        var rValue = expr_eval(opStack, obj);
        return lValue || rValue;
      }
    }
  } else if (type === 'binary') {
    var bOp = op[1];
    var lValue = expr_eval(opStack, obj);
    var rValue = expr_eval(opStack, obj);
    if (bOp === '===') {
      return lValue === rValue;
    } else if (bOp === '!==') {
      return lValue !== rValue;
    } else if (bOp === '==') {
      return lValue == rValue;
    } else if (bOp === '!=') {
      return lValue != rValue;
    } else if (bOp === '=~') {
      if (isRegExp(lValue)) {
        return rValue.match(lValue);
      } else {
        return lValue.match(rValue);
      }
    } else if (bOp === '!~') {
      if (isRegExp(lValue)) {
        return !rValue.match(lValue);
      } else {
        return !lValue.match(rValue);
      }
    } else if (bOp === '*') {
      return lValue * rValue;
    } else if (bOp === '/') {
      return lValue / rValue;
    } else if (bOp === '%') {
      return lValue % rValue;
    } else if (bOp === '+') {
      return lValue + rValue;
    } else if (bOp === '-') {
      return lValue - rValue;
    } else if (bOp === '<<') {
      return lValue << rValue;
    } else if (bOp === '>>') {
      return lValue >> rValue;
    } else if (bOp === '>>>') {
      return lValue >>> rValue;
    } else if (bOp === '<') {
      return lValue < rValue;
    } else if (bOp === '<=') {
      return lValue <= rValue;
    } else if (bOp === '>') {
      return lValue > rValue;
    } else if (bOp === '>=') {
      return lValue >= rValue;
    } else if (bOp === 'in') {
      return lValue in rValue;
    } else if (bOp === 'instanceof') {
      return lValue instanceof rValue;
    } else if (bOp === '&') {
      return lValue & rValue;
    } else if (bOp === '^') {
      return lValue ^ rValue;
    } else if (bOp === '|') {
      return lValue | rValue;
    }
  } else if (type === 'unary-prefix') {
    var uOp = op[1];
    var uValue = expr_eval(opStack, obj);
    if (uOp === '+') {
      return uValue;
    } else if (uOp === '-') {
      return -uValue;
    } else if (uOp === '!') {
      return !uValue;
    } else if (uOp === '~') {
      return ~uValue;
    } else if (uOp === 'typeof') {
      return typeof uValue;
    }
  } else {
    if (type === 'name') {
      if (op[1] === 'this') {
        return obj;
      } else if(op[1] === 'global') {
        return global;
      } else {
        var prop = op[1];
        return obj[prop];
      }
    } else if (type === 'num' || type ===  'string' || type === 'array') {
      var value = op[1];
      return value;
    } else if (type === 'regexp') {
      var value = new RegExp(op[1], op[2]);
      return value;
    } else if (type === 'dot') {
      var object = expr_eval(opStack, obj);
      var prop = op[2];
      return object[prop];
    } else if (type === 'sub') {
      var object = expr_eval(opStack, obj);
      var prop = expr_eval(opStack, obj);
      return object[prop];
    } else {
     throw "no support operation";
    } 
  }
};
