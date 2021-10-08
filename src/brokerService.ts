import * as amqp from 'amqplib/callback_api';
const rabbitUrl: string = process.env.BROKER_URL || "";

let connection: any = null;
let channel: any = null;

// (async () => {
//     try {
//         [connection, channel] = await Promise.all([amqp.connect(rabbitUrl), connection.createChannel()]);
//     } catch (e) {
//         console.log("Error connecting to broker", e)
//     }
// })();


export const publishToQueue = async (queueName: string, data: any) => {
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {persistent: true});
}


process.on('beforeExit', () => {
    console.log('closing broker channel and connection')
    channel.close()
    connection.close()
})

