const { Events } = require('discord.js');

module.exports = {
    name: Events.InviteCreate,
    async execute(invite) {
        invite.client.invites[invite.code] = invite.uses;
    }
}