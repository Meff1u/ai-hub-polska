const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    id: '1134458628175310868',
    ephemeral: true,
    type: 'moderation',
    desc: 'Czyszczenie kanału z nadmiaru wiadomości.',
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Czyści kanał z wiadomości.')
    .addIntegerOption(o => o
        .setName('amount')
        .setDescription('Podaj ilość wiadomości do wyczyszczenia (od 1 do 100)')
        .setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        if (amount < 1 || amount > 100) return await interaction.followUp({ content: 'Wybierz liczbę wiadomości do usunięcia od 1 do 100!' });
        const channel = interaction.channel;
        const modchannel = await interaction.guild.channels.fetch('1134459462585942076');
        await channel.bulkDelete(amount).then(async (m) => {
            const log = new EmbedBuilder()
            .setAuthor({ name: 'Usunięcie wiadomości', iconURL: 'https://i.imgur.com/hnWxPRI.png' })
            .setDescription(`• Ilość usuniętych wiadomości: **${amount}**\n• Kanał: **${channel}**`)
            .setFooter({ text: interaction.member.user.username, iconURL: interaction.member.user.displayAvatarURL() })
            .setTimestamp(Date.now())
            .setColor('#ffffff');
            modchannel.send({ embeds: [log] });
            await interaction.followUp({ content: `Pomyślnie usunięto **${amount}** wiadomości!` });
        }).catch(console.error);
    }
}