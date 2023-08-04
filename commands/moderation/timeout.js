const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const memberdata = require('../../memberdata.json');
const ms = require('ms');

module.exports = {
    id: '1136955455059529808',
    ephemeral: false,
    type: 'moderation',
    desc: 'Wyciszenie użytkownika.',
    data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Wyciszenie użytkownika.')
    .addUserOption(o => o
        .setName('user')
        .setDescription('Wybierz użytkownika, którego chcesz wyciszyć.')
        .setRequired(true))
    .addStringOption(o => o
        .setName('powód')
        .setDescription('Podaj powód wyciszenia.')
        .setRequired(true))
    .addStringOption(o => o
        .setName('czas')
        .setDescription('Podaj ile czasu ma trwać timeout. (np. 5d, 10m, 1h 30m itp.)')
        .setRequired(true)),
    async execute(interaction) {
        const totimeout = interaction.options.getMember('user');
        const reason = interaction.options.getString('powód');
        const timeouttime = ms(interaction.options.getString('czas'));
        if (totimeout.roles.cache.has('1124567158475735040') || totimeout.roles.cache.has('1124566737644421321')) return await interaction.followUp({ content: `Nie możesz wyciszyć użytkownika należącego do administracji lub moderacji!`, ephemeral: true });
        if (totimeout.isCommunicationDisabled()) return await interaction.followUp({ content: 'Ten użytkownik jest już wyciszony!' });
        if (!memberdata.find(m => m.id === totimeout.id)) memberdata.push({ id: totimeout.id, punishments: [] });
        const mmember = memberdata.find(m => m.id === totimeout.id);
        if (!mmember.punishments) mmember.punishments = [];
        totimeout.timeout(timeouttime, reason).then( async() => {
            const time = Date.now();
            mmember.punishments.unshift({ type: 'Timeout', reason: reason, timestamp: time, by: interaction.member.id });
            await interaction.followUp({ content: `Pomyślnie wyciszono \`${totimeout.user.username}\`! Powód: \`${reason}\`` });
            const modchannel = await interaction.member.guild.channels.fetch('1134459462585942076');
            const log = new EmbedBuilder()
            .setAuthor({ name: 'Wyciszenie', iconURL: 'https://i.imgur.com/OKMyFBI.png' })
            .setDescription(`• Oznaczenie: **${totimeout}**\n• ID: **${totimeout.id}**\n• Powód wyciszenia: **${reason}**\n• Czas wyciszenia: **${ms(timeouttime, { long: true })}**`)
            .setFooter({ text: interaction.member.user.username, iconURL: interaction.member.user.displayAvatarURL() })
            .setTimestamp(time)
            .setColor('#FFA500');
            modchannel.send({ embeds: [log] });
        }).catch(console.error);
    }
}