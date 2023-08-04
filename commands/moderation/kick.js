const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const memberdata = require('../../memberdata.json');

module.exports = {
    id: '1135568208900927489',
    ephemeral: false,
    type: 'moderation',
    desc: 'Wyrzucanie użytkownika z serwera.',
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Wyrzucanie użytkownika z serwera.')
    .addUserOption(o => o
        .setName('user')
        .setDescription('Wybierz użytkownika, którego chcesz wyrzucić.')
        .setRequired(true))
    .addStringOption(o => o
        .setName('powód')
        .setDescription('Podaj powód wyrzucenia')
        .setRequired(true)),
    async execute(interaction) {
        const tokick = interaction.options.getMember('user');
        const reason = interaction.options.getString('powód');
        if (tokick.roles.cache.has('1124567158475735040') || tokick.roles.cache.has('1124566737644421321')) return await interaction.followUp({ content: `Nie możesz wyrzucić użytkownika należącego do administracji lub moderacji!` });
        if (!memberdata.find(m => m.id === tokick.id)) memberdata.push({ id: tokick.id, punishments: [] });
        const mmember = memberdata.find(m => m.id === tokick.id);
        if (!mmember.punishments) mmember.punishments = [];
        await tokick.kick(reason);
        const time = Date.now();
        mmember.punishments.unshift({ type: 'Wyrzucenie', reason: reason, timestamp: time, by: interaction.member.id });
        await interaction.followUp({ content: `Pomyślnie wyrzucono \`${tokick.user.username}\`! Powód: \`${reason}\`` });
        const modchannel = await interaction.member.guild.channels.fetch('1134459462585942076');
        const log = new EmbedBuilder()
        .setAuthor({ name: 'Wyrzucenie', iconURL: 'https://i.imgur.com/upMCK7a.png' })
        .setDescription(`• Oznaczenie: **${tokick}**\n• ID: **${tokick.id}**\n• Powód wyrzucenia: **${reason}**`)
        .setFooter({ text: interaction.member.user.username, iconURL: interaction.member.user.displayAvatarURL() })
        .setTimestamp(time)
        .setColor('#FFA500');
        modchannel.send({ embeds: [log] });
    }
}