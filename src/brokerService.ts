// import amqp, { Channel, Connection } from 'amqplib/callback_api';
import * as amqp from 'amqplib/callback_api';
import * as amqpConMgr from 'amqp-connection-manager';
const rabbitUrl = process.env.BROKER_URL;

const brokerConnection = async () => {
    try{
        const connection = await amqpConMgr.connect(rabbitUrl);

        const channelWrapper: amqpConMgr.ChannelWrapper = await connection.createChannel({
            json: true,
            setup: async (channel: amqp.ConfirmChannel): Promise<void> => {
                // `channel` here is a regular amqplib `ConfirmChannel`. Unfortunately its typings make it return a bluebird-specific promise
                // tslint:disable-next-line:await-promise
                await channel.assertQueue('UpdateTransaction', {durable: true});
            }
        });

        console.log("in connection !!!!!!!!!!!!!!!!", connection)

        console.log("in channel !&&&&&!", channelWrapper)

        return { connection, channelWrapper }
    }
    catch (e) {
        console.log("Error connecting to broker", e)
        return;
    }
}

const publishToQueue = async (ch: any, queueName: string, data: any) => {
    ch.sendToQueue(queueName, new Buffer(data));
}

export {
    brokerConnection,
    publishToQueue
}

