const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        const general = await member.guild.channels.fetch('1124566636020633662');
        general.send(`[-] **${member.user.username}** <a:papa:1133797290209980466> (${member.guild.members.cache.size})`);
        const modchannel = await member.guild.channels.fetch('1134459462585942076');
        const log = new EmbedBuilder()
        .setAuthor({ name: 'Opuszczenie serwera', iconURL: 'https://i.imgur.com/ms38xYF.png' })
        .setDescription(`• Nazwa: **${member.user.username}**\n• ID: **${member.id}**\n• Data utworzenia konta: **<t:${Math.round(member.user.createdTimestamp / 1000)}:F>** (<t:${Math.round(member.user.createdTimestamp / 1000)}:R>)\n• Data dołączenia na serwer: **<t:${Math.round(member.joinedTimestamp / 1000)}:F>** (<t:${Math.round(member.joinedTimestamp / 1000)}:R>)`)
        .setFooter({ text: member.user.username, iconURL: member.user.displayAvatarURL() })
        .setTimestamp(Date.now())
        .setColor('#ffffff');
        modchannel.send({ embeds: [log] });
    }
}