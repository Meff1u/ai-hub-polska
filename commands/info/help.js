const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    ephemeral: true,
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Komendy bota'),
    async execute(interaction) {
        await interaction.followUp('WIP');
    }
}