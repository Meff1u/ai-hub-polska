const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const Spotify = require('spottydl');
const fs = require('node:fs');

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
            const track = await Spotify.getTrack(url);
            if (track.toString().includes('Error')) return await interaction.editReply('Błąd, upewnij się, że dałeś link do __utworu spotify__, nie albumu lub playlisty, czy innej platformy.');
            const title = `${track.artist} - ${track.title}`;
            await interaction.followUp(`Pobieranie **${title}**...`);
            await Spotify.downloadTrack(track, './tracks').then(async r => {
                if (r[0].status === 'Success') {
                    const file = new AttachmentBuilder(r[0].filename, { name: `${title}.mp3` });
                    await interaction.editReply({ content: 'Done.', files: [file] });
                    fs.unlinkSync(r[0].filename, (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                }
            });
        } catch (err) {
            console.log(err);
            return await interaction.followUp({ content: 'Link musi być do __utworu spotify__, nie albumu lub playlisty.\n(jeśli jednak dałeś link do utworu, oznacza to, że to jakiś poważny błąd i zgłoś to administratorowi, dzięki)' });
        }
    }
}