const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { falai, imgbbkey } = require('../../config.json');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const axios = require(`axios`);
const imgbbUploader = require("imgbb-uploader");
const fs = require('node:fs')

module.exports = {
    id: '1157244706800025660',
    ephemeral: false,
    type: 'misc',
    desc: 'Tworzenie iluzji z innego zdjęcia za pomocą AI.',
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName('illusion')
    .setDescription('Tworzenie iluzji z innego zdjęcia za pomocą AI.')
    .addStringOption(o => o
        .setName('prompt')
        .setDescription('Szczegółowy opis do wygenerowania obrazu (po angielsku, im więcej tym lepiej)')
        .setRequired(true))
    .addAttachmentOption(o => o
        .setName('image')
        .setDescription('Wstaw zdjęcie do przerobienia.')
        .setRequired(true)),
    async execute(interaction) {
        const prompt = interaction.options.getString('prompt');
        const image = interaction.options.getAttachment('image');

        if (image.contentType !== 'image/jpeg' && image.contentType !== 'image/png') return await interaction.followUp({ content: 'Proszę podesłać zdjęcie.' });
        await download(image.attachment, image.name, 'assets/illusion');
        const imbboptions = {
            apiKey: imgbbkey,
            imagePath: `./assets/illusion/${image.name}`,
            expiration: 3600
        };
        let uploaded = await upload(imbboptions);
        await fs.unlinkSync(`./assets/illusion/${image.name}`);

        const options = {
            method: 'POST',
            headers: {
                Authorization: `Key ${falai.ID}:${falai.secret}`,
                'Content-Type': 'application/json'
            },
            body: `{"image_url":"${uploaded.url}","prompt":"(masterpiece:1.4), (best quality), (detailed), ${prompt}"}`
        };
        const url = 'https://54285744-illusion-diffusion.gateway.alpha.fal.ai/'

        const generatedimage = await generate(url, options);

        if (generatedimage.image?.url) {
            const orginal = new EmbedBuilder().setTitle('Oryginalne zdjęcie:').setImage(image.proxyURL);
            const converted = new EmbedBuilder().setTitle('Przerobione zdjęcie:').setDescription(`*${prompt}*`).setImage(generatedimage.image.url);
            await interaction.followUp({ embeds: [orginal, converted] });
        }
        else {
            console.log(generatedimage.message);
            await interaction.followUp({ content: 'Jakis error, spróbuj ponownie xd' });
        }
    }
}

async function generate(url, options) {
    try {
        const data = await fetch(url, options).then(res => res.json());
        return data;
    } catch (error) {
        console.error(error);
        return error;
    }
}

async function download(url, filename, path){
    const resp = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    const writer = fs.createWriteStream(`${path}/${filename}`);

    resp.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function upload(options) {
    const data = await imgbbUploader(options).catch((error) => console.error(error));
    return data;
}