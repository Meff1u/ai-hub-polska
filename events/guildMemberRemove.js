const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        const general = await member.guild.channels.fetch('1124566636020633662');
        general.send(`[-] ${member} <a:papa:1133797290209980466> (${member.guild.members.cache.size})`);
    }
}