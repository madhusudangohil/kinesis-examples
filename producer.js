const Client = require("./KinesisClient");

class Producer {
  constructor(kinesis, config) {
    this.kinesis = kinesis;
    this.config = config;
  }

  writeToStream(user) {
    let record = JSON.stringify(user);
    let partitionKey = user.id;
    let recordParams = {
      Data: record,
      PartitionKey: user.id.toString(),
      StreamName: this.config.stream
    };

    return this.kinesis.putRecord(recordParams).promise();
  }

  writeAggregateToStream(users) {
    const client = new Client(this.config.stream);

    return client.PublishEvents(user);
  }
}

module.exports = Producer;
