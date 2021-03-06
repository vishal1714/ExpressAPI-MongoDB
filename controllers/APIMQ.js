const amqp = require("amqplib/callback_api");
const dotenv = require("dotenv");
const moment = require("moment");
const RandomString = require("randomstring");
dotenv.config({ path: "../config/Config.env" });

let i = 0;

const SendMQ = (exchange, msg) => {
  amqp.connect(process.env.RabbitMQ_URL, function (error0, conn) {
    if (error0) {
      throw error0;
    }
    conn.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      function Random() {
        return RandomString.generate({
          length: 3,
          charset: "numeric",
        });
      }
      var DayID = moment().tz("Asia/Kolkata").format("YYYYMMDDhhmmss");
      var ModifiedMessage = {
        Data: msg,
        MQ_ID: DayID + Random() + i,
      };
      var Message = JSON.stringify(ModifiedMessage);

      const Queue1 = "APILogFile";
      const Queue2 = "APILogDB";

      channel.assertExchange(exchange, "fanout", {
        durable: true,
      });
      channel.assertQueue(Queue1, {
        durable: true,
      });
      channel.assertQueue(Queue2, {
        durable: true,
      });
      channel.bindQueue(Queue1, exchange, "");
      channel.bindQueue(Queue2, exchange, "");
      channel.publish(exchange, "", Buffer.from(Message));
      i++;
      /*
      channel.assertQueue(Queue, {
        durable: true,
      });
      channel.sendToQueue(Queue, Buffer.from(Message), { persistent: true });
      */
      setTimeout(function () {
        conn.close();
      }, 500);
    });
  });
};

const ReceiverMQ = (Queue, MongoSchemaObject) => {
  amqp.connect(process.env.RabbitMQ_URL, function (error0, conn) {
    if (error0) {
      throw error0;
    }
    conn.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      channel.assertQueue(Queue, {
        durable: true,
      });
      var i = 0;
      channel.consume(
        Queue,
        async (msg) => {
          const Message = JSON.parse(msg.content.toString());
          const test = await MongoSchemaObject.create(Message.Data);
          i++;
          console.log(
            `Queue Name -> ${Queue} | Published| MQ ID -> ${Message.MQ_ID} | Meesage Logged Date -> ${Message.Data.LoggedAt}`
          );
        },
        {
          noAck: true,
        }
      );
      setTimeout(function () {
        conn.close();
        console.log(`MQ Receiver Processed ${i} Requests`);
      }, 50000);
    });
  });
};

module.exports = { SendMQ, ReceiverMQ };
