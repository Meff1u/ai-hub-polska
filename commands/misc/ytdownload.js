const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const yt = require("yt-converter");
const fs = require('node:fs');

module.exports = {
    id: '?',
    ephemeral: false,
    type: 'misc',
    desc: 'Pobieranie piosenek z YT.',
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName('ytdownload')
    .setDescription('Pobieranie piosenek z YT.')
    .addStringOption(o => o
        .setName('yt_url')
        .setDescription('Link do piosenki z YT.')
        .setRequired(true)),
    async execute(interaction) {
        const url = interaction.options.getString('yt_url');

        try {
            const url_info = await yt.getInfo(url);
            if (Number(url_info.lengthSecods) > 600) return await interaction.followUp({ content: 'Pobierany film nie może być dłuższy niż 10 minut!' });
            const download = await yt.convertAudio({
                url: url,
                itag: 140,
                directoryDownload: './tracks',
                title: url_info.title
            }, onData, onClose);
            await interaction.followUp({ content: `Pobieranie i konwersja **${download}**...` })

            function onData() {
                // nothing
            }

            async function onClose() {
                const file = new AttachmentBuilder(`./tracks/${download}.mp3`, { name: `${download}.mp3` });
                await interaction.editReply({ content: 'Pobrano.', files: [file] });
                fs.unlinkSync(`./tracks/${download}.mp3`, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }
        }
        catch (err) {
            if (err.toString().includes('No video id found')) return await interaction.followUp({ content: 'Podaj poprawny adres url lub id filmu!' });
            else {
                await interaction.followUp({ content: 'Wystąpił błąd, spróbuj ponownie.' })
                console.error(err.stack);
            }
        }

    }
}