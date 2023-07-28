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
            { name: `${threads.threads.size - 1} models!`, type: ActivityType.Watching }
        ]
        setInterval(() => {
            state = (state + 1) % presences.length;
            client.user.setPresence({ activities: [presences[state]], status: 'dnd' });
        }, 15000);
    }
}