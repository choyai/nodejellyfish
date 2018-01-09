var express = require('express');
var request = require('request');
var router = express.Router();
//var mongo = require('mongodb').MongoClient;
var assert = require('assert');

//var url = 'mongodb://localhost:27017/exampledb';

/* API homepage */
router.get('/', function(req, res, next) {
  res.locals.obj = null;
  res.render('mcu');
});

router.post('/', function(req, res, next){
  var obj = {
    TeamID: req.body.TeamID,
    lat: req.body.lat,
    long: req.body.long
  }
  res.render('showresponse', {
    obj: obj
  });
});

// GET data from TeamID

router.get('/:TeamID/:sensor', function(req, res, next){
  var teamID = req.params.TeamID;
  var sensor = req.params.sensor;
  request('http://10.0.0.10/api/' + sensor + '/' +  teamID , function(error, response, body) {
      // res.json(body);
      assert.equal(null, error);
      var sensorResponse = JSON.parse(body);
      console.log(sensorResponse);
      var data = sensorResponse.data();
      console.log(data);
      // res.send(body);
      res.render('request', {
        data: data,
      });
  });

});



//GET all MCUs from mongodb
/*
router.get('/get', function(req, res, next){
  var resultArray = [];
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    var cursor = db.collection('objects').find();
    cursor.forEach(function(doc, err){
      assert.equal(null, err);
      resultArray.push(doc);
    }, function(){
      db.close();
      res.json({items: resultArray});
    })
  })
});
*/

/* POST to mongoDB
router.post('/', function(req, res, next){
  var obj = {
    name: req.body.name,
  }
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('objects').insertOne(obj, function(err, result){
      assert.equal(null, err);
      console.log('inserted');
      db.close();
    });
  });
  res.json({message: "success"});
});
*/



module.exports = router;
