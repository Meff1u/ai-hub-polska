const { Events, ActivityType } = require('discord.js');
const { serverID } = require('../config.json');

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
        let state = 0;
        const presences = [
            { name: `${fetchMembers(client)} members <3`, type: ActivityType.Watching },
            { name: `${threads.threads.size - 1} models!`, type: ActivityType.Watching }
        ]
        setInterval(async () => {
            await client.guilds.cache.get(serverID).members.fetch();
            state = (state + 1) % presences.length;
            client.user.setPresence({ activities: [presences[state]], status: 'dnd' });
        }, 15000);

        client.guilds.cache.each(guild => {
            guild.invites.fetch().then(ginvites => {
                ginvites.each(ginvite => {
                    client.invites[ginvite.code] = ginvite.uses;
                })
            })
        })
    }
}

async function fetchMembers(client) {
    return await client.guilds.cache.get(serverID).members.fetch().size;
}