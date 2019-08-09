"use strict";

const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });
const RecordAggregator = require("aws-kinesis-agg/lib/kpl-agg");
const deagg = require("aws-kinesis-agg/lib/kpl-deagg");
class KinesisClient {
  constructor(streamName) {
    this.kinesis = new AWS.Kinesis();
    this.streamName = streamName;
    this.aggregator = new RecordAggregator();
  }

  PublishEvents(events) {
    console.info("Entering PublishEvent Method");
    let self = this;
    return new Promise((resolve, reject) => {
      try {
        let records = this.ConvertEventsToRecords(events);
        if (records.length === 0) reject("No events found for publishing");
        this.aggregator.aggregateRecords(records, true, (err, aggRecord) => {
          if (err) console.error(err);
          let params = {
            Data: aggRecord.data,
            PartitionKey: aggRecord.partitionKey,
            StreamName: self.streamName
          };
          console.info("Writing to stream");
          console.log(params);
          self.kinesis.putRecord(params, function(err, response) {
            console.info("after put record");
            if (err) {
              console.error(err);
              reject(err);
            } else {
              console.log(response);
              resolve(response);
            }
            console.info("Exiting PublishEvent Method");
          });
        });
      } catch (ex) {
        console.error(ex);
      }
    });
  }

  ConvertEventsToRecords(eventList) {
    let timestamp = Date.now().toString();
    let partitionKey = "test" + timestamp;
    return eventList.map(function(event) {
      return {
        data: new Buffer.from(JSON.stringify(event)),
        partitionKey: partitionKey // use dynamic partition key.For Example,timestamp with any static string.
      };
    });
  }
}

module.exports = KinesisClient;
