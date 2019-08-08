class Producer {
  constructor(kinesis, config) {
    this.kinesis = kinesis;
    this.config = config;
  }

  readFromStream() {
    let record = JSON.stringify(user);
    let partitionKey = user.id;
    let recordParams = {
      Data: record,
      PartitionKey: user.id.toString(),
      StreamName: this.config.stream
    };

    return this.kinesis.getRecord(recordParams).promise();
  }
}

module.exports = Producer;
