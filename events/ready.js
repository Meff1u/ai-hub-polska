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

        let state = 0;
        const presences = 2
        setInterval(async () => {
            if (state === 0) {
                const members = await client.guilds.cache.get(serverID).members.fetch();
                client.user.setPresence({ activities: [{ name: `${members.size} members <3`, type: ActivityType.Watching }], status: 'dnd' });
            }
            else if (state === 1) {
                const channel = await client.channels.fetch('1124570199018967075');
                const threads = await channel.threads.fetch();
                client.user.setPresence({ activities: [{ name: `${threads.threads.size} models!`, type: ActivityType.Watching }], status: 'dnd' });
            }
            state = (state + 1) % presences;
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