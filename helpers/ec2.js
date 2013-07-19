
"use strict";

var AWS = require('aws-sdk');
var config = require('../config');
AWS.config.loadFromPath('config.json');

var ec2 = new AWS.EC2();

// var handleError = function(callback){
//   return function(error){
//     var args = arguments;

//     if (error) return callback(error);

//     if (2 === args.length) return callback(error, args[1]);
//     if (3 === args.length) return callback(error, args[1], args[2]);
//     if (4 === args.length) return callback(error, args[1], args[2], args[3]);
//     if (5 === args.length) return callback(error, args[1], args[2], args[3], args[4]);
//     if (6 === args.length) return callback(error, args[1], args[2], args[3], args[4], args[5]);
//     if (7 === args.length) return callback(error, args[1], args[2], args[3], args[4], args[5], args[6]);
//     if (8 === args.length) return callback(error, args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
//     if (9 >= args.length) return callback.apply(null, [].slice.call(args));
//   };
// };

// Get list of instances from EC2
exports.instances = function(callback){
  var instances = [];
  ec2.describeInstances(function(err, data) {
    if (err) return callback(err);
    data.Reservations.forEach(function(r){
      r.Instances.forEach(function(i){
        var launchTime = Date.parse(i.LaunchTime); // in milliseconds
        var currentTime = new Date().getTime(); // ditto
        var upTime = currentTime - launchTime;
        var formattedUpTime = formatUptime(upTime);
        i["upTime"] = formattedUpTime;
        instances.push(i);
      });
    });
    return callback(null, instances);
  });
};

exports.run = function(data, callback){
  var error;

  if (!data) {
    error = new Error('Missing parameters');
    if (callback) return callback(error);
    else throw error;
  }

  if (data && !(+data.instances)){
    error = new Error('Mininum number of instances is 1');
    if (callback) return callback(error);
    else throw error;
  }

  var ec2params = {
    ImageId: data.image || config.ec2.ami,
    MinCount: 1,
    MaxCount: +data.instances,
    InstanceType: data.type,
    InstanceInitiatedShutdownBehavior: data.shutdownBehavior || config.ec2.shutdownBehavior,
    KeyName: config.ec2.keyName,
    SecurityGroupIds: config.ec2.securityGroup
  };

  ec2.runInstances(ec2params, callback);
};

exports.start = function(data, callback){
  var error;

  if (!data) {
    error = new Error('Missing parameters');
    if (callback) return callback(error);
    else throw error;
  }

  if (data && !data.id){
    error = new Error('Missing instance id(s) to start');
    if (callback) return callback(error);
    else throw error;
  }

  ec2.startInstances({ InstanceIds: [data.id] }, callback);
}

exports.stop = function(data, callback){
  var error;

  if (!data) {
    error = new Error('Missing parameters');
    if (callback) return callback(error);
    else throw error;
  }

  if (data && !data.id){
    error = new Error('Missing instance id(s) to stop');
    if (callback) return callback(error);
    else throw error;
  }

  ec2.stopInstances({ InstanceIds: [data.id] }, callback);
}

exports.terminate = function(data, callback){
  var error;

  if (!data) {
    error = new Error('Missing parameters');
    if (callback) return callback(error);
    else throw error;
  }

  if (data && !data.id){
    error = new Error('Missing instance id(s) to terminate');
    if (callback) return callback(error);
    else throw error;
  }

  ec2.terminateInstances({ InstanceIds: (''+data.id).split(',') }, callback);
}

function formatUptime(ticks) {
  ticks /= 1000;
  var secs = parseInt(ticks % 60);
  var mins = parseInt(ticks / 60 % 60);
  var hours = parseInt(ticks / 3600 % 24);
  var days = parseInt(ticks / 86400);

  var uptimeString = "";
  if (days > 0) {
    uptimeString += days;
    uptimeString += ((days == 1) ? " day" : " days");
  }
  if (hours > 0) {
    uptimeString += ((days > 0) ? ", " : "") + hours;
    uptimeString += ((hours == 1) ? " hour" : " hours");
  }
  if (mins > 0) {
    uptimeString += ((days > 0 || hours > 0) ? ", " : "") + mins;
    uptimeString += ((mins == 1) ? " minute" : " minutes");
  }
  if (secs > 0) {
    uptimeString += ((days > 0 || hours > 0 || mins > 0) ? ", " : "") + secs;
    uptimeString += ((secs == 1) ? " second" : " seconds");
  }
  //console.log(uptimeString);
  return uptimeString;
}
// -
