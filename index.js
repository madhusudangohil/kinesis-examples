"use strict";
let AWS = require("aws-sdk");
let config = require("./config");
let Producer = new require("./producer");

const kinesis = new AWS.Kinesis({ region: config.region });

let producer = new Producer(kinesis, config);

(async () => {
  let user = {};
  let users = [];
  for (let i = 0; i < 100; i++) {
    user.id = i;
    user.name = "test " + i.toString();
    user.dob = new Date().getDate();
    //await producer.writeToStream(user);
    users.push(user);
  }
  await producer.writeAggregateToStream(users);
})();
