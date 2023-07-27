const { Events } = require('discord.js');
const memberdata = require('../memberdata.json');
const fs = require('node:fs');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        if (!memberdata.find(m => m.id === message.member.id)) memberdata.push({ id: message.member.id, level: { xp: 0, lvl: 1 } });
        const mmember = memberdata.find(m => m.id === message.member.id);
        mmember.messages ? mmember.messages += 1 : mmember.messages = 1;

        const { lvlcooldowns } = message.client;
        if (!lvlcooldowns.has(message.member.id)) {
            const gainedxp = getRandomXp(5, 15);
            mmember.level.xp += gainedxp;
            if (mmember.level.xp >= mmember.level.lvl * 150) {
                mmember.level.xp -= mmember.level.lvl * 150;
                mmember.level.lvl += 1;
                message.client.channels.cache.get('1124566636020633662').send(`<a:peepoJAMMER:1133830488788840478> ${message.member} **LEVEL UP!!** (${mmember.level.lvl}) <a:peepoJAMMER:1133830488788840478>`);
            }

            const now = Date.now();
            lvlcooldowns.set(message.member.id, now);
            setTimeout(() => lvlcooldowns.delete(message.member.id), 60000);
        }
        fs.writeFileSync(`./memberdata.json`, JSON.stringify(memberdata));

        if (message.channelId === '1126081259546886174') {
            message.react('⬆️');
            message.react('⬇️');
        }
    }
}

function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}