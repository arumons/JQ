exports.JQ = function(json) {
  var json = JSON.parse(json);
  return function(prop) {
    var result = [];
    filter(json, prop, result);
    return result;
  };
};

var filter = function(json, prop, result) {
  if (typeof json === 'number') return;
  if (typeof json === 'string') return;
  if (typeof json === 'boolean') return;
  if (json === null) return;
  if (Array.isArray(json) === true) {
    for (var i = 0, l = json.length; i < l; i++) {
      filter(json[i], prop, result);
    }
    return;
  }
  if (typeof json === 'object') {
    for (var p in json) {
      if (p === prop) {
        result.push(json);
      }
      filter(json[p], prop, result);
    }
  }
};

