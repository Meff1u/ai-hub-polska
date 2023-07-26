const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.channelId === '1126081259546886174') {
            message.react('⬆️');
            message.react('⬇️');
        }
    }
}