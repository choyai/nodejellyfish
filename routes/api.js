var express = require('express');
var request = require('request');
var router = express.Router();
//var mongo = require('mongodb').MongoClient;
var assert = require('assert');
//var mongoose = require('mongoose');
var https = require('https');

var schema = require('../models/schema');
//var db = require('../models/db');

//var url = 'mongodb://localhost:27017/exampledb';

//Status code
const status = {
  "00": {
    code: "00",
    desc: "Success"
  },
  "01": {
    code: "01",
    desc: "Cannot find the given TeamID"
  },
  "02": {
    code: "02",
    desc: "Cannot find the requested data"
  }
};



/* API homepage */
router.get('/', function(req, res, next) {
  res.locals.obj = null;
  res.render('mcu');
});

/* POST data */
router.post('/', function(req, res, next) {
  var obj = {
    TeamID: req.body.TeamID,
    lat: req.body.lat,
    long: req.body.long
  }
  res.render('showresponse', {
    obj: obj
  });
});

// GET data from TeamID & sensor

router.get('/test/:TeamID/:sensor', function(req, res, next) {
  var teamID = req.params.TeamID;
  var sensor = req.params.sensor;
  request('http://10.0.0.10/api/' + sensor + '/' + teamID, function(error, response, body) {
    // res.json(body);
    assert.equal(null, error);
    var sensorResponse = JSON.parse(body);
    console.log(sensorResponse);
    var data = sensorResponse.data;
    console.log(data);

    // res.send(body);
    res.render('request', {
      data: data,
    });
  });

});

//GET data for 1 teamID

router.get('/team/:teamID', function(req, res, next) {
  var resultArray = [];
  requestTeam(req, res, function(resultArray) {
    res.render('index', {
      title: resultArray[0].sensID
    });
    console.log('hey');
  });
  console.log('ho');
});

function requestTeam(req, res, callback) {
  console.log('succ');
  var sensors = ['temperature', 'accelerometer', 'din1'];
  /*var body = {
    "name":"John",
    "age":30,
    "data": [
        { "sensID":"Ford", "date":[ "Fiesta", "Focus", "Mustang" ] },
        { "sensID":"BMW", "date":[ "320", "X3", "X5" ] },
        { "sensID":"Fiat", "date":[ "500", "Panda" ] }
    ]
 }*/

  for (sensor in sensors) {
    request('http://10.0.0.10/api/' + sensor + '/' + req.params.teamID, function(error, response, body) {
      console.log(body.data);
      resultArray.push(body.data);
    });
  }
  if (typeof callback === "function") {
    callback();
  }
}

//GET all MCUs from mongodb

router.get('/db', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('objects').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.json({
        items: resultArray
      });
    })
  })
});


// POST to mongoDB
router.post('/db', function(req, res, next) {
  var obj = {
    name: req.body.name,
  }
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('objects').insertOne(obj, function(err, result) {
      assert.equal(null, err);
      console.log('inserted');
      db.close();
    });
  });
  res.render('dbrend', {
    obj: obj
  });

});




module.exports = router;
