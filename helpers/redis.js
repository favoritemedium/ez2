
"use strict";

var redis = require('redis');
var client = redis.createClient();

exports.logEntry = function(entryData, callback) {

  var currentTime = new Date();
  var user = entryData.user;
  var email = entryData.email;
  var instances = entryData.instances;

  for(var i = 0; i < instances.length; i++) {
    client.hmset(instances[i], "name", user, "email", email, "date", currentTime);
  }
};

exports.readEntry = function(instances, callback) {
  var array = [];

  for(var i = 0; i < instances.length; i++) {
    client.hgetall(instances[i].InstanceId, function(error, data) {
      if (error) {
        console.log(error); // an error occurred
      } else {
        array.push(data);

        if(instances.length == array.length) {
          for(var i = 0; i < array.length; i++) {
            if (array[i] != null) {
              instances[i]["name"] = array[i].name;
              instances[i]["email"] = array[i].email;
              instances[i]["createdDate"] = array[i].date;

              var expired = new Date(Date.parse(array[i].date));
              expired.setDate(expired.getDate() + 30);
              instances[i]["expiredDate"] = expired;
            }
          }
          return callback(null, instances);
        }
      }
    });
  }
}



