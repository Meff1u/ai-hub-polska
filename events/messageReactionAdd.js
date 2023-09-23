const { Events, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const sblist = require('../starboard.json');
const fs = require('fs');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        if (reaction._emoji.name != '⭐' || reaction.message.id === '1154551285614379038') return;
        if (sblist.includes(reaction.message.id)) return console.log('already starboarded');
        const member = await reaction.message.guild.members.cache.get(user.id);
        if (member.roles.cache.has('1124567158475735040') || member.roles.cache.has('1124566737644421321')) {
            const message = await reaction.message.guild.channels.cache.get(reaction.message.channelId).messages.fetch(reaction.message.id);
            const starboard = await reaction.message.guild.channels.fetch('1154551285614379038');
            const e = new EmbedBuilder()
                .setColor('#FFAC33')
                .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
                .setDescription(message.content)
                .setFooter({ text: `ID: ${message.id}` })
                .setTimestamp(message.createdTimestamp);
            let embeds = [];
            let buttons = [];
            if (message.attachments.size > 0) {
                message.attachments.forEach((att) => {
                    if (att.contentType === 'image/png') {
                        const attc = new EmbedBuilder().setColor('#FFAC33').setImage(att.url);
                        embeds.push(attc);
                    }
                    else if (att.contentType === 'audio/mpeg') {
                        const audio = new ButtonBuilder().setLabel(`${att.name} (${bytesToSize(att.size)})`).setURL(att.url).setStyle(ButtonStyle.Link);
                        buttons.push(audio);
                    }
                });
            }
            if (buttons.length > 0) {
                const row = new ActionRowBuilder().addComponents(buttons);
                await starboard.send({ content: message.url, embeds: [e, ...embeds], components: [row] });
            }
            else {
                await starboard.send({ content: message.url, embeds: [e, ...embeds] });
            }
            sblist.push(reaction.message.id);
            fs.writeFileSync('./starboard.json', JSON.stringify(sblist), 'utf-8');
        }
    }
}

function bytesToSize(bytes, seperator = "") {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes == 0) return 'n/a'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
    if (i === 0) return `${bytes}${seperator}${sizes[i]}`
    return `${(bytes / (1024 ** i)).toFixed(1)}${seperator}${sizes[i]}`
  }