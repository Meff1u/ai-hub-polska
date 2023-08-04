const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const memberdata = require('../../memberdata.json');

module.exports = {
    id: '1136701420440137750',
    ephemeral: false,
    type: 'moderation',
    desc: 'Nadanie użytkownikowi ostrzeżenia.',
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Nadanie użytkownikowi ostrzeżenia.')
    .addUserOption(o => o
        .setName('user')
        .setDescription('Wybierz użytkownika, którego chcesz ostrzec.')
        .setRequired(true))
    .addStringOption(o => o
        .setName('powód')
        .setDescription('Podaj powód ostrzeżenia')
        .setRequired(true)),
    async execute(interaction) {
        const tokick = interaction.options.getMember('user');
        const reason = interaction.options.getString('powód');
        if (tokick.roles.cache.has('1124567158475735040') || tokick.roles.cache.has('1124566737644421321')) return await interaction.followUp({ content: `Nie możesz ostrzec użytkownika należącego do administracji lub moderacji!`, ephemeral: true });
        if (!memberdata.find(m => m.id === tokick.id)) memberdata.push({ id: tokick.id, punishments: [] });
        const mmember = memberdata.find(m => m.id === tokick.id);
        if (!mmember.punishments) mmember.punishments = [];
        const time = Date.now();
        mmember.punishments.unshift({ type: 'Ostrzeżenie', reason: reason, timestamp: time, by: interaction.member.id });
        await interaction.followUp({ content: `Pomyślnie ostrzeżono \`${tokick.user.username}\`! Powód: \`${reason}\` *(To jego ${mmember.punishments.filter(x => x.type == 'Wyrzucenie').length} ostrzeżenie)*` });
        const modchannel = await interaction.member.guild.channels.fetch('1134459462585942076');
        const log = new EmbedBuilder()
        .setAuthor({ name: 'Ostrzeżenie', iconURL: 'https://i.imgur.com/e14To0e.png' })
        .setDescription(`• Oznaczenie: **${tokick}**\n• ID: **${tokick.id}**\n• Powód ostrzeżenia: **${reason}**`)
        .setFooter({ text: interaction.member.user.username, iconURL: interaction.member.user.displayAvatarURL() })
        .setTimestamp(time)
        .setColor('#FFFF00');
        modchannel.send({ embeds: [log] });
    }
}