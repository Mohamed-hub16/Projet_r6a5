'use strict';

const { Service } = require('@hapipal/schmervice');
const amqp = require('amqplib');

module.exports = class BrokerService extends Service {
    constructor(server, options) {
        super(server, options);
        this.connection = null;
        this.channel = null;
    }

    async initialize() {
        this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue('csv_exports', { durable: true });
    }

    async publishCSVExport(userId, csvBuffer) {
        if (!this.channel) {
            await this.initialize();
        }

        await this.channel.sendToQueue('csv_exports', Buffer.from(JSON.stringify({
            userId,
            csvContent: csvBuffer.toString('base64')
        })));
    }

    async startConsumer() {
        if (!this.channel) {
            await this.initialize();
        }

        const { mailService } = this.server.services();
        const { User } = this.server.models();

        await this.channel.consume('csv_exports', async (msg) => {
            if (msg !== null) {
                const { userId, csvContent } = JSON.parse(msg.content.toString());
                const user = await User.query().findById(userId);
                
                if (user) {
                    await mailService.sendCSVExport(user, Buffer.from(csvContent, 'base64'));
                }
                
                this.channel.ack(msg);
            }
        });
    }
}