const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    id: '1133794557969047714',
    ephemeral: true,
    type: 'info',
    desc: 'Lista wszystkich dostępnych komend.',
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Komendy bota'),
    async execute(interaction) {
        const { commands } = interaction.client;
        let info = [], misc = [], moderation = [];
        commands.forEach(async (c) => {
            if (c.type === 'info') info.push({ name: c.data.name, id: c.id, desc: c.desc });
            else if (c.type === 'misc') misc.push({ name: c.data.name, id: c.id, desc: c.desc });
            else if (c.type === 'moderation') moderation.push({ name: c.data.name, id: c.id, desc: c.desc });
        });
        const e = new EmbedBuilder()
        .setTitle('AI Hub Polska | Dostępne komendy')
        .setThumbnail(interaction.guild.iconURL())
        .setColor('#ffffff')
        .addFields(
            { name: '__Informacyjne__', value: info.map(c => `</${c.name}:${c.id}> | ${c.desc}`).join('\n') },
            { name: '__Różne__', value: misc.map(c => `</${c.name}:${c.id}> | ${c.desc}`).join('\n') }
        );
        if (interaction.member.roles.cache.has('1124566737644421321') || interaction.member.roles.cache.has('1124567158475735040')) {
            e.addFields(
                { name: '__Moderacyjne__', value: moderation.map(c => `</${c.name}:${c.id}> | ${c.desc}`).join('\n') }
            );
        }
        await interaction.followUp({ embeds: [e] });
    }
}