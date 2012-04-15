var should = require('should');
var JQ = require('./jq.js').JQ;

describe('JQ', function(){

  var json_string = '{"a": 1, "b": 2, "c": {"d": 4}}';
  var js_object = {
    a: 1,
    b: 2,
    c: {
       a: 1,
       d: 4
    }
  };

  describe('init', function() {
    it('should return JQ object when a valid json string passed', function() {
      var jq = JQ(json_string);
      jq.should.be.a('function');
      jq.isJQ.should.be.true;
    });
    
    it('should return JQ object when a javascript object passed', function() {
      var jq = JQ(js_object);
      jq.should.be.a('function');
      jq.isJQ.should.be.true;
    });
  });

  describe('baseObject', function() {
    it('should return a base object', function() {
      var jq = JQ(js_object);
      jq.baseObject.should.be.a('object');
      jq.baseObject.should.eql(js_object);
    });
  });

  describe('size', function() {
    it('should return a length of objects JQ object contain', function() {
      var jq = JQ(js_object);
      jq.size().should.eql(1);

      jq('a').size().should.eql(2);
      jq('b').size().should.eql(1);
      jq('c').size().should.eql(1);
      jq('d').size().should.eql(1);
      
      jq('e').size().should.eql(0);
    });
  });

  describe('get', function() {
    it('return the nth element in the matched object set', function() {
      var jq = JQ(js_object);
      jq('a').get(0).should.eql(js_object);
      jq('a').get(1).should.eql({a: 1, d: 4});
    });

    it('return the whole matched object set', function() {
      var jq = JQ(js_object);
      jq('a').get().should.eql([js_object, {a: 1, d:4}]);
    });
  });

  describe('(propertyName)', function() {
    it('should return a new JQ object that contain the object that have the provided property name', function() {
      var jq = JQ(js_object);
      jq('a').size().should.eql(2);
      jq('a').get(0).should.eql(js_object);
      jq('a').get(1).should.eql({a:1, d:4});
      should.not.exist(jq('a').get(2));

      jq('b').size().should.eql(1);
      jq('b').get(0).should.eql(js_object);
      should.not.exist(jq('b').get(1));
    })
  });



});

//  it('can get original json from jq object', function() {
//    JSON.parse(json_test).should.eql(jq.json);
//  });
//
//  it('should return object when selector passed', function() {
//    var filtered = jq('a');
//    filtered.should.be.a('object');
//  });
//
//  it('should return values when value equal arg passed', function() {
//    var props = jq('a', 1).props('a');
//    props.should.eql([1]);
//
//    var props = jq('a', 2).props('a');
//    props.should.eql([]);
//
//    var props = jq('b', 3).props('a');
//    props.should.eql([]);
//
//    var props = jq('d', 4).props('d');
//    props.should.eql([4]);
//
//  });
//
//  it('shoud return values binded prop passed', function() {
//    var props = jq('a').props('a');
//    props.should.eql([1]);
//    
//    var props = jq('a').props('b');
//    props.should.eql([2]);
//
//    var props = jq('a').props('c');
//    props.should.eql([{"d": 4}]);
//
//    var props = jq('d').props("a");
//    props.should.eql([]);
//
//    var props = jq('d').props('d');
//    props.should.eql([4]);
//  });
//
//  it('shoud update values by argument passed', function() {
//    var props = jq('a').props('a', 10);
//    props.should.eql([10]);
//
//    var props = jq('b').props('b', 20);
//    props.should.eql([20]);
//
//    var props = jq('d').props('e', 30);
//    props.should.eql([30]);
//  });

//});
  
