const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    ephemeral: false,
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName('pico')
    .setDescription('Wyszukiwarka z picosong')
    .addStringOption(o => o
        .setName('fraza')
        .setDescription('Wpisz frazę wyszukiwania')
        .setRequired(true)),
    async execute(interaction) {
        if (!interaction.client.pico) return await interaction.followUp('Trwa fetchowanie bazy danych picosong, proszę spróbować ponownie później.')
        const fraza = interaction.options.getString('fraza');
        let txt = '';
        await interaction.followUp('Wyszukiwanie... Proszę uzbroić się w cierpliwość...');
        interaction.client.pico.forEach(e => {
            if (e.split('//')[0].toLowerCase().includes(fraza.toLowerCase())) {
                txt += `${e.split('//')[0]}|${e.split('//')[1] + e.split('//')[2] + e.split('//')[3]}\n`;
            }
        });
        fs.writeFileSync('./znalezione.txt', txt);
        const att = new AttachmentBuilder('./znalezione.txt');
        await interaction.editReply({ content: 'Done.', files: [att] });
    }
}