var should = require('should');
var JQ = require('./jq.js').JQ;

describe('JQ', function(){

  var js_object = {
    a: 1,
    b: 2,
    c: {
       a: 1,
       d: 4
    }
  };
  
  var json_string = JSON.stringify(js_object);

  describe('init', function() {
    it('should return JQ object when a valid json string passed', function() {
      var jq = JQ(json_string);
      jq.should.be.a('function');
      jq.isJQ().should.be.true;
    });
    
    it('should return JQ object when a javascript object passed', function() {
      var jq = JQ(js_object);
      jq.should.be.a('function');
      jq.isJQ().should.be.true;
    });
  });

  describe('baseObject', function() {
    it('should return a base object', function() {
      var jq = JQ(js_object);
      jq.baseObject().should.be.a('object');
      jq.baseObject().should.eql(js_object);

      jq('a').baseObject().should.eql(js_object);
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
      jq.get(0).should.eql(js_object);

      jq('a').get(0).should.eql(js_object);
      jq('a').get(1).should.eql(js_object.c);
    });

    it('return the whole matched object set', function() {
      var jq = JQ(js_object);
      jq.get().should.eql([js_object]);

      jq('a').get().should.eql([js_object, js_object.c]);
    });
  });

  describe('eq', function() {
    it('return the new JQ object that only have the nth element in the matched object set', function() {
      var jq = JQ(js_object);
      jq.size().should.eql(1);

      jq('a').size().should.eql(2);
      jq('a').eq(0).get(0).should.eql(js_object);
      jq('a').eq(1).get(0).should.eql(js_object.c);
      jq('a').eq(2).empty().should.be.true;
    });
  });

  describe('(propertyName)', function() {
    it('should return a new JQ object that contain the object that have the provided property name', function() {
      var jq = JQ(js_object);
      jq('a').size().should.eql(2);
      jq('a').get(0).should.eql(js_object);
      jq('a').get(1).should.eql({a:1, d:4});
      jq('a').eq(2).empty().should.be.true;
      should.not.exist(jq('a').get(2));

      jq('b').size().should.eql(1);
      jq('b').get(0).should.eql(js_object);
      should.not.exist(jq('b').get(1));
    })
  });

  describe('props', function() {
    describe('(key)', function() {
      it('should return a array of value binded to passed key', function() {
        var jq = JQ(js_object);
        jq.props('a').should.eql([js_object.a]);
        jq.props('b').should.eql([js_object.b]);
        jq.props('c').should.eql([js_object.c]);

        jq.props('e').should.be.empty;

        jq('a').props('a').should.eql([js_object.a, js_object.c.a]);
        jq('a').props('b').should.eql([js_object.b]);
      });
    })
  });
});

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
  
