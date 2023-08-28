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
            });
        });

        /*const m = await client.channels.cache.get('1145622047721017354').messages.fetch('1145622463003246703');
        const e = new EmbedBuilder()
            .setTitle('Strefa Informacji - wszystko co potrzebne.')
            .setDescription('Poniżej znajdziesz przyciski, które zawierają najpotrzebniejsze wam informacje. Kliknij na konkretny, aby otrzymać więcej informacji.\n\n**Oddzielanie wokali** - Linki do stron/programów umożliwiające w łatwy sposób oddzielenie wokalu od instrumentalu.\n**Tworzenie coverów/modeli - Strony** - Linki do stron umożliwiających tworzenie coverów/modeli przez przeglądarke (dla użytkowników o słabym sprzęcie)\n**Tworzenie coverów/modeli - Lokalnie** - Linki do repozytoriów RVC do lokalnego tworzenia coverów i modeli. (Dla użytkowników o dobrym sprzęcie)\n**Poradniki** - Linki do poradników dot. tworzenia coverów i modeli za pomocą AI.\n**FAQ** - Najczęściej zadawane pytania.\n**Oficjalne AI Hub** - Link na oficjalny serwer discord AI Hub.')
            .setColor('#ff0000')
            .setThumbnail(m.guild.iconURL());
        const b1 = new ButtonBuilder().setCustomId('info1').setLabel('Oddzielanie wokali').setStyle(ButtonStyle.Success);
        const b2 = new ButtonBuilder().setCustomId('info2').setLabel('Tworzenie coverów/modeli - Strony').setStyle(ButtonStyle.Success);
        const b3 = new ButtonBuilder().setCustomId('info3').setLabel('Tworzenie coverów/modeli - Lokalnie').setStyle(ButtonStyle.Success);
        const b4 = new ButtonBuilder().setCustomId('info4').setLabel('Poradniki').setStyle(ButtonStyle.Success);
        const b5 = new ButtonBuilder().setCustomId('info5').setLabel('FAQ').setStyle(ButtonStyle.Success);
        const b6 = new ButtonBuilder().setLabel('Oficjalne AI Hub').setStyle(ButtonStyle.Link).setURL('https://discord.gg/aihub');
        const row1 = new ActionRowBuilder().addComponents(b1, b2, b3, b4, b5);
        const row2 = new ActionRowBuilder().addComponents(b6);
        await m.edit({ content: '', embeds: [e], components: [row1, row2] });*/
    }
}