const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (message.guildId !== '1124566634456174605' ) return;
        const msgchannel = await message.guild.channels.fetch('1162363367420342293');
        const e = new EmbedBuilder()
            .setAuthor({ name: 'Usunięta wiadomość', iconURL: 'https://i.imgur.com/oR0AVfu.png' })
            .setColor('#ff0000')
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setTimestamp(Date.now())
            .addFields(
                { name: 'Autor:', value: `${message.author}`, inline: true },
                { name: 'Informacje:', value: `Kanał: <#${message.channelId}>\nID: ${message.id}\nZawierało pliki: ${message.attachments?.size > 0 ? 'Tak' : 'Nie'}`, inline: true },
                { name: 'Treść:', value: `\`\`\`\n${message.content}\n\`\`\`` }
            );
        await msgchannel.send({ embeds: [e] });
    }
}