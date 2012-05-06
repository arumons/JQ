var parser = require('./parser');

var extend = function(from, to) {
  for (var p in from) {
    to[p] = from[p];
  }
};

exports.JQ = function(obj) {
  if (typeof obj === 'string') {
    obj = JSON.parse(obj);
  }

  var jq = function(condition) {
    var results = [];
    var paths = [];
    condition = parser.compile(condition);
    filter(obj, results, [], paths, condition);
    return new JQ(obj, results, paths);
  };

  jq._baseObject = obj;
  jq._results = [obj];
  jq._paths = [];

  extend(JQ.prototype, jq);
  return jq;
};

exports.JQ.hello = function() {
  if (console) {
    if (console.log) {
      console.log("hello! I'm JQ library!");
      return;
    }
  }
  if (alert) {
    alert("hello! I'm JQ library!");
  }
};
  
var filter = function(obj, results, path, paths, condition) {
  if (typeof obj === 'number') return;
  if (typeof obj === 'string') return;
  if (typeof obj === 'boolean') return;
  if (obj === null) return;

  if (Array.isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      path.push(i);
      filter(obj[i], results, path, paths, condition);
      path.pop();
    }
    return;
  }

  if (typeof obj === 'object') {
    if (condition(obj)) {
      var _path = path.slice();
      paths.push(_path);
      results.push(obj);
    }
    for (var p in obj) {
      path.push(p);
      filter(obj[p], results, path, paths, condition);
      path.pop();
    }
  }
};

var JQ = function(obj, results, paths) {
  this._baseObject = obj;
  this._results = results;
  this._paths = paths;
};

JQ.prototype.isJQ = function() {
  return true;
};

JQ.prototype.baseObject = function() {
  return this._baseObject;
};

JQ.prototype.size = function() {
  return this._results.length;
};

JQ.prototype.get = function(index) {
  if (index === null || index === undefined) {
    return this._results;
  }
  return this._results[index];
};

JQ.prototype.eq = function(index) {
  var baseObject = this.baseObject();
  var results = [];
  if (this.get(index)) {
    results.push(this.get(index));
  }
  return new JQ(baseObject, results);
};

var _clearProperty = function(obj) {
  for (var p in obj) {
    delete obj[p];
  }
};

JQ.prototype.empty = function() {
  for (var i in this._results) {
    _clearProperty(this._results[i]);
  }
  return this;
};

JQ.prototype.prop = function(prop, val) {
  // get
  if (arguments.length === 1) {
    if (this._results.length === 0) {
      return undefined;
    }
    return this._results[0][prop];
  }

  // set
  for (var i = 0, l = this._results.length; i < l; i++) {
    this._results[i][prop] = val;
  }
  return this;
};

JQ.prototype.remove = function() {
  // delte all property from root
  if (this._paths.length === 0) {
    _clearProperty(this.baseObject());
    return this;
  }

  for (var i = 0, len = this._paths.length; i < len; i++) {
    _remove(this.baseObject(), this._paths[i]);
  }
  return this;
};

var _remove = function (obj, path) {
  var len = path.length;
  if (len === 0) {
    _clearProperty(obj);
    return;
  }
  for (var i = 0, l = len; i < len -1; i++) {
    obj = obj[path[i]];
  }
  delete obj[path[path.length -1]]
};

JQ.prototype.removeProp = function(prop) {
  if (this._paths.length === 0) {
    delete this.baseObject()[prop];
  }

  for (var i = 0, len = this._paths.length; i < len; i++) {
    var path = this._paths[i].slice();
    path.push(prop);
    _remove(this.baseObject(), path);
  }
};

JQ.prototype.each = function(fn) {
  var isContinue;
  for (var i = 0, l = this._results.length; i < l; i++) {
    isContinue = fn.call(this._results[i], i, this._results[i]);
    if (isContinue === false) {
      return this;
    }
  }
};

JQ.prototype.map = function(fn) {
  var results = [];
  for (var i = 0, l = this._results.length; i < l; i++) {
    results.push(fn.call(this._results[i], i, this._results[i]));
  }
  return new JQ(results);
};
