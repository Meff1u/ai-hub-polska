const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const general = await member.guild.channels.fetch('1124566636020633662');
        general.send(`[+] ${member} <a:hi:1133797463623475230> (${member.guild.members.cache.size})`);
        const modchannel = await interaction.guild.channels.fetch('1134459462585942076');
        const newInvites = await member.guild.invites.fetch();
        console.log(newInvites);
        const log = new EmbedBuilder()
        .setAuthor({ name: 'Dołączenie na serwer', iconURL: 'https://i.imgur.com/3lZDg9z.png' });
    }
}