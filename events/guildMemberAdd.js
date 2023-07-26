const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const general = await member.guild.channels.fetch('1124566636020633662');
        general.send(`[+] ${member} <a:hi:1133797463623475230> (${member.guild.members.cache.size})`);
    }
}