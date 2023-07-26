const { SlashCommandBuilder } = require('discord.js');
const Spotify = require('spotifydl-core').default;
const { spotify } = require('../../config.json');
const fs = require('node:fs');

const credentials = {
    clientId: spotify.ID,
    clientSecret: spotify.secret
}

const s = new Spotify(credentials);

module.exports = {
    ephemeral: false,
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName('download')
    .setDescription('Pobieranie piosenek ze spotify.')
    .addStringOption(o => o
        .setName('spotify_url')
        .setDescription('Link do piosenki spotify.')
        .setRequired(true)),
    async execute(interaction) {
        const url = interaction.options.getString('spotify_url');

        try {
            const track = await s.getTrack(url);
            const title = `${track.artists.map(a => a).join(', ')} - ${track.name}`;
            await interaction.followUp(`Pobieranie **${title}**...`);
            const song = await s.downloadTrack(url, `${title}.mp3`);
            fs.writeFileSync(`${title}.mp3`, song);
            console.log('downloaded');

        } catch (err) {
            return await interaction.followUp({ content: 'Link musi być do __utworu.__, nie albumu lub playlisty.' });
        }
    }
}