var extend = function(from, to) {
  for (var p in from) {
    to[p] = from[p];
  }
};

exports.JQ = function(json) {
  if (typeof json === 'string') {
    json = JSON.parse(json);
  }

  var jq = function(prop, value) {
    var jsons = [];
    filter(json, jsons, prop, value);
    return new JQ(json, jsons);
  };

  jq._baseObject = json;
  jq._jsons = [json];

  extend(JQ.prototype, jq);
  return jq;
};

var filter = function(json, result, prop, value) {
  if (typeof json === 'number') return;
  if (typeof json === 'string') return;
  if (typeof json === 'boolean') return;
  if (json === null) return;
  if (Array.isArray(json)) {
    for (var i = 0, l = json.length; i < l; i++) {
      filter(json[i], prop, result);
    }
    return;
  }
  if (typeof json === 'object') {
    for (var p in json) {
      if (p === prop && (value === undefined || json[p] === value)) {
        result.push(json);
      }
      filter(json[p], result, prop, value);
    }
  }
};

var JQ = function(json, jsons) {
  this._baseObject = json;
  this._jsons = jsons;
};

JQ.prototype.isJQ = function() {
  return true;
};

JQ.prototype.baseObject = function() {
  return this._baseObject;
};

JQ.prototype.size = function() {
  return this._jsons.length;
};

JQ.prototype.get = function(index) {
  if (index === null || index === undefined) {
    return this._jsons;
  }
  return this._jsons[index];
};

JQ.prototype.eq = function(index) {
  var baseObject = this.baseObject();
  var jsons = [];
  if (this.get(index)) {
    jsons.push(this.get(index));
  }

  return new JQ(baseObject, jsons);
};

JQ.prototype.empty = function() {
  if (this._jsons.length === 0) {
    return true;
  }
  return false;
};

JQ.prototype.props = function(prop, val) {
  var result = [];
  for (var i = 0, l = this._jsons.length; i < l; i++) {
    if (val !== undefined) {
      this._jsons[i][prop] = val;
    }
    if (prop in this._jsons[i]) {
      result.push(this._jsons[i][prop]);
    }
  }
  return result;
};

JQ.prototype.delete = function() {
};
