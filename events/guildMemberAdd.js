const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const general = await member.guild.channels.fetch('1124566636020633662');
        general.send(`[+] ${member} <a:hi:1133797463623475230> (${member.guild.members.cache.size})`);
        const modchannel = await member.guild.channels.fetch('1134459462585942076');
        let zaproszenie = '';
        member.guild.invites.fetch().then(ginvites => {
            ginvites.each(invite => {
                if (invite.uses !== client.invites[invite.code]) {
                    client.invites[invite.code] = invite.uses;
                    zaproszenie = invite;
                }
            })
        });
        const log = new EmbedBuilder()
        .setAuthor({ name: 'Dołączenie na serwer', iconURL: 'https://i.imgur.com/3lZDg9z.png' })
        .addFields(
            { name: 'Użytkownik:', value: `• Oznaczenie: ${member}\n• ID: **${member.id}**\n• Data utworzenia konta: **<t:${Math.round(member.user.createdTimestamp / 1000)}:F>** (<t:${Math.round(member.user.createdTimestamp / 1000)}:R>)`, inline: true },
            { name: 'Zaproszenie:', value: `• Kod: **${zaproszenie.code}**\n• Użyć: **${zaproszenie.uses}**\n• Stworzone przez: **${zaproszenie.inviter}**`, inline: true }
        )
        .setFooter({ text: member.user.username, iconURL: member.user.displayAvatarURL() })
        .setTimestamp(Date.now())
        .setColor('#ffffff');
        modchannel.send({ embeds: [log] });
    }
}