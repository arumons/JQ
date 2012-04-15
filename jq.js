exports.JQ = function(json) {
  if (typeof json === 'string') {
    json = JSON.parse(json);
  }
  var jq = function(prop, value) {
    var jsons = [];
    filter(json, jsons, prop, value);
    return new JQ(json, jsons);
  };
  jq.isJQ = true;
  jq.baseObject = json;
  jq.size = function() {return 1;};
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
  this.json = json;
  this.jsons = jsons;
};

JQ.prototype.size = function() {
  return this.jsons.length;
};

JQ.prototype.get = function(index) {
  if(index === null || index === undefined) {
    return this.jsons;
  }
  return this.jsons[index];
};

JQ.prototype.eq = undefined;

JQ.prototype.props = function(prop, val) {
  var result = [];
  for (var i = 0, l = this.jsons.length; i < l; i++) {
    if (val !== undefined) {
      this.jsons[i][prop] = val;
    }
    if (prop in this.jsons[i]) {
      result.push(this.jsons[i][prop]);
    }
  }
  return result;
};

JQ.prototype.delete = function() {
  

};
