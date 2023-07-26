const { Events, ActivityType } = require('discord.js');
const { serverID } = require('../config.json');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(client.user.tag);
        client.guilds.cache.forEach(async (g) => {
            await g.members.fetch({ cache: true });
            console.log(`Fetched members for ${g.name} (${g.memberCount})`);
        });
        const channel = await client.channels.fetch('1124570199018967075');
        const threads = await channel.threads.fetch();
        const members = await client.guilds.cache.get(serverID).members.fetch();
        let state = 0;
        const presences = [
            { name: `${members.size} members <3`, type: ActivityType.Watching },
            { name: `${threads.threads.size} models!`, type: ActivityType.Watching }
        ]
        setInterval(() => {
            state = (state + 1) % presences.length;
            client.user.setPresence({ activities: [presences[state]], status: 'dnd' });
        }, 15000);
        let json1 = await fetch('https://raw.githubusercontent.com/ogohogo/picosong/main/all-formatted-extra/p0.json').then(res => res.json());
        let json2 = await fetch('https://raw.githubusercontent.com/ogohogo/picosong/main/all-formatted-extra/p1.json').then(res => res.json());
        let json3 = await fetch('https://raw.githubusercontent.com/ogohogo/picosong/main/all-formatted-extra/p2.json').then(res => res.json());
        let json4 = await fetch('https://raw.githubusercontent.com/ogohogo/picosong/main/all-formatted-extra/p3.json').then(res => res.json());
        let json5 = await fetch('https://raw.githubusercontent.com/ogohogo/picosong/main/all-formatted-extra/p4.json').then(res => res.json());
        let json6 = await fetch('https://raw.githubusercontent.com/ogohogo/picosong/main/all-formatted-extra/p5.json').then(res => res.json());
        let json7 = await fetch('https://raw.githubusercontent.com/ogohogo/picosong/main/all-formatted-extra/p6.json').then(res => res.json());
        let json8 = await fetch('https://raw.githubusercontent.com/ogohogo/picosong/main/all-formatted-extra/p7.json').then(res => res.json());
        let json9 = await fetch('https://raw.githubusercontent.com/ogohogo/picosong/main/all-formatted-extra/p8.json').then(res => res.json());
        let json10 = await fetch('https://raw.githubusercontent.com/ogohogo/picosong/main/all-formatted-extra/p9.json').then(res => res.json());
        let json11 = await fetch('https://raw.githubusercontent.com/ogohogo/picosong/main/all-formatted-extra/p10.json').then(res => res.json());
        let json12 = await fetch('https://raw.githubusercontent.com/ogohogo/picosong/main/all-formatted-extra/p11.json').then(res => res.json());
        let json13 = await fetch('https://raw.githubusercontent.com/ogohogo/picosong/main/all-formatted-extra/p12.json').then(res => res.json());
        let json14 = await fetch('https://raw.githubusercontent.com/ogohogo/picosong/main/all-formatted-extra/p13.json').then(res => res.json());
        console.log('All picos fetched.');
        const pico = [...json1, ...json2, ...json3, ...json4, ...json5, ...json6, ...json7, ...json8, ...json9, ...json10, ...json11, ...json12, ...json13, ...json14];
        console.log('All picos Merged.');
        client.pico = pico;
    }
}