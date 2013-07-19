
"use strict";

var ec2 = require('../helpers/ec2');
var redis = require('../helpers/redis');

// Routes for instances

// GET /instances
// list of instance
exports.list = function(req, res, next){
  ec2.instances(function(err, instances){
    if (err) return next(err);

    redis.readEntry(instances, function(err, readInstances) {
      if (err) return next(err);

      var instances = { running:[], stopped:[] };

      readInstances.forEach(function(i){
        var ns = 'running' === i.State.Name ? 'running' : 'stopped';
        instances[ns].push(i);
      });

      res.render('instance/list', {
        title: 'Instances',
        instances: instances
      });
    });
  });
};

// GET /instances/:id
// instance info
// exports.info = function(req, res, next){
//   var id = req.params.id;
//   var instance = instances[id-1];

//   res.render('instance/info', {
//     title: 'Instance:' + instance.name
//   , instance: instance
//   });
// };

// GET /instances/create
// create new instance
exports.create = function(req, res, next){
  res.render('instance/create', {
    title: 'Create Instance'
  });
};

// POST /instances/create
//save instance
exports.save = function(req, res, next) {
  ec2.run(req.body, function(err, data) {
    if (err) return next(err);

    var instances = []
    for(var i = 0; i < data.Instances.length; i++) {
      instances.push(data.Instances[i].InstanceId);
    }

    var log = {
      user:req.session.user,
      email: req.session.email,
      instances:instances
    }

    redis.logEntry(log);
    res.redirect('/instances');
  });
};

// START /instances/start/:id
// starts an instance
exports.start = function(req, res, next){
  ec2.start({ id:req.params.id }, function(err, data){
    if (err) return next(err);
    res.redirect('/instances');
  });
};

// STOP /instances/stop/:id
// stops an instance
exports.stop = function(req, res, next){
  ec2.stop({ id:req.params.id }, function(err, data){
    if (err) return next(err);
    res.redirect('/instances');
  });
};

// DELETE /instances/terminate/:id
// terminates an instance
exports.terminate = function(req, res, next){
  ec2.terminate({ id:req.params.id }, function(err, data){
    if (err) return next(err);
    res.redirect('/instances#stopped-instances');
  });
};

// GET /instances/snapshot/:id
// list of snapshots for an instance
exports.snapshot = function(req, res, next){
  var id = req.params.id;

  ec2Params = {
    InstanceId: id,
    Attribute: "blockDeviceMapping"
  }

  ec2.describeInstanceAttribute(ec2Params, function(error, data) {
    if (error) {
      console.log(error); // an error occurred
      next(error);
    } else {
      console.log("Success on getting VolumeId");

      var volId = data.BlockDeviceMappings[0].Ebs.VolumeId;

      ec2Params = {
        VolumeId: volId,
        Description: "Node Snapshot"
      }

      ec2.createSnapshot(ec2Params, function(error, data) {
        if (error) {
          console.log(error); // an error occurred
          next(error);
        } else {
          console.log("Success on snapshotting");
          res.redirect('/instances');
        }
      });
    }
  });
};

// -

