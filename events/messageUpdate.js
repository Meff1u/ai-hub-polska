const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldmes, newmes) {
        if (newmes.guildId !== '1124566634456174605' || newmes.author?.bot || oldmes.content == newmes.content ) return;
        const msgchannel = await newmes.guild.channels.fetch('1162363367420342293');
        const e = new EmbedBuilder()
            .setAuthor({ name: 'Zedytowana wiadomość', iconURL: 'https://i.imgur.com/enkXCsr.png' })
            .setColor('#ffff00')
            .setFooter({ text: newmes.author.username, iconURL: newmes.author.displayAvatarURL() })
            .setTimestamp(Date.now())
            .addFields(
                { name: 'Autor:', value: `${newmes.author}`, inline: true },
                { name: 'Informacje:', value: `Link do wiadomości: [Kliknij](${newmes.url})\nID: ${newmes.id}`, inline: true },
                { name: 'Treść przed edycją:', value: `\`\`\`\n${oldmes.content}\n\`\`\``, inline: false },
                { name: 'Treść po edycji:', value: `\`\`\`\n${newmes.content}\n\`\`\``, inline: false }
            );
        await msgchannel.send({ embeds: [e] });
    }
}