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
      var $jq = JQ(json_string);
      $jq.should.be.a('function');
      $jq.isJQ().should.be.true;
    });
    
    it('should return JQ object when a javascript object passed', function() {
      var $jq = JQ(js_object);
      $jq.should.be.a('function');
      $jq.isJQ().should.be.true;
    });

    it('should return JQ object when a array passed', function() {
      var $jq = JQ([1,2,3]);
      $jq.should.be.a('function');
      $jq.isJQ().should.be.true;
      $jq.baseObject().should.eql([1,2,3]);
    });
  });

  describe('baseObject', function() {
    it('should return a base object', function() {
      var $jq = JQ(js_object);
      $jq.baseObject().should.be.a('object');
      $jq.baseObject().should.eql(js_object);

      $jq('a').baseObject().should.eql(js_object);
    });
  });

  describe('size', function() {
    it('should return a length of objects JQ object contain', function() {
      var $jq = JQ(js_object);
      $jq.size().should.eql(1);

      $jq('a').size().should.eql(2);
      $jq('b').size().should.eql(1);
      $jq('c').size().should.eql(1);
      $jq('d').size().should.eql(1);
      
      $jq('e').size().should.eql(0);
    });
  });

  describe('get', function() {
    it('return the nth element in the matched object set', function() {
      var $jq = JQ(js_object);
      $jq.get(0).should.eql(js_object);

      $jq('a').get(0).should.eql(js_object);
      $jq('a').get(1).should.eql(js_object.c);
    });

    it('return the whole matched object set', function() {
      var $jq = JQ(js_object);
      $jq.get().should.eql([js_object]);

      $jq('a').get().should.eql([js_object, js_object.c]);
    });
  });

  describe('eq', function() {
    it('return the new JQ object that only have the nth element in the matched object set', function() {
      var $jq = JQ(js_object);
      $jq.size().should.eql(1);

      $jq('a').size().should.eql(2);
      $jq('a').eq(0).get(0).should.eql(js_object);
      $jq('a').eq(1).get(0).should.eql(js_object.c);
    });
  });

  describe('empty', function() {
    it('remove all properties from the matched object set', function() {
      var $jq = JQ(json_string);
      $jq.empty();
      $jq.baseObject().should.eql({});

      $jq = JQ(json_string);
      $jq("d").empty();
      $jq.baseObject().a.should.eql(1);
      $jq.baseObject().c.should.eql({});
    });
  });

  describe('(condition expr)', function() {
    it('should return a new JQ object that contain the object that have the provided condition expr', function() {
      var $jq = JQ(js_object);
      $jq('a').size().should.eql(2);
      $jq('a').get(0).should.eql(js_object);
      $jq('a').get(1).should.eql({a:1, d:4});
      should.not.exist($jq('a').get(2));

      $jq('b').size().should.eql(1);
      $jq('b').get(0).should.eql(js_object);
      should.not.exist($jq('b').get(1));

      $jq('a === 1 && d === 4').size().should.eql(1);
      $jq('a === 1 && d === 4').get(0).should.eql(js_object.c);
    })
  });

  describe('prop', function() {
    describe('(key)', function() {
      it('should return value of a property for the first element in the set of matched elements', function() {
        var $jq = JQ(js_object);
        $jq.prop('a').should.eql(js_object.a);
        $jq.prop('b').should.eql(js_object.b);
        $jq.prop('c').should.eql(js_object.c);
        should.not.exist($jq.prop('e'));

        $jq('a').prop('a').should.eql(js_object.a, js_object.c.a);
        $jq('a').prop('b').should.eql(js_object.b);
      });
    })

    describe('(key, value)', function() {
      it('should set property for the set of matched elements', function() {
        var $jq = JQ(json_string);
        $jq('a').prop('a', 10);
        var o = JSON.parse(json_string);
        o.a = 10;
        o.c.a = 10;
        $jq.baseObject().should.eql(o);
      });
    });
  });

  describe('remove', function() {
    it('remove all properties from the matched object set', function() {
       var $jq = JQ(json_string);
       $jq.remove();
       $jq.baseObject().should.eql({});
 
       $jq = JQ(json_string);
       $jq('d').remove();
       should.not.exist($jq.baseObject().c);
 
      var $jq = JQ(json_string);
      $jq('a === 1').remove();
      $jq.baseObject().should.eql({});
    })
  });

  describe('removeProp', function() {
    it('remove property from the matched object set', function() {
      var $jq = JQ(json_string);
      $jq.removeProp('a');
      console.log($jq.baseObject());
      should.not.exist($jq.baseObject().a);

      $jq = JQ(json_string);
      $jq('d').removeProp('d');
      should.not.exist($jq.baseObject().c.d);
    })
  });

  describe('each', function() {
    it('iterate over a JQ object, executing a function for each matched element', function() {
      var $jq = JQ(json_string);
      $jq.each(function() {
        this.should.eql(js_object);
      });
      
      $jq('a').each(function(i) {
        if (i === 0) {
          this.should.eql(js_object);
        } else if (i === 1) {
          this.should.eql(js_object.c);
        }
      });

      var count = 0;
      $jq('a').each(function() {
        count++;
        return false;
      });
      count.should.be.eql(1);
    });
  });

  describe('map', function() {
    it('pass each element in the current matched set throuth a function, producing a new JQ object containing the return values', function() {
      var $jq = JQ(json_string);
      var result = $jq.map(function() {
        return this.a;
      });
      result.baseObject().should.eql([1]);

      result = $jq('a').map(function(i) {
        return this.a * 10;
      });
      result.baseObject().should.eql([10, 10]);
    })
  })
});
