const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    id: '1164155758624112700',
    ephemeral: false,
    type: 'moderation',
    desc: 'Lista wszystkich postów na ai-models.',
    data: new SlashCommandBuilder()
    .setName('postlist')
    .setDescription('Lista wszystkich postów na ai-models.'),
    async execute(interaction) {
        const channel = await interaction.client.channels.fetch('1124570199018967075');
        const threads = await channel.threads.fetchActive();
        const archivedoptions = {
            fetchAll: true,
        };
        const threadsa = await fetchAllArchivedThreads(channel, archivedoptions);
        let txt = '';
        threads.threads.forEach(async (t) => {
            let mem = interaction.guild.members.cache.get(t.ownerId);
            if (mem) {
                txt += `${t.name} | ${mem.user.username} | ${t.parentId}/${t.id}\n`;
            }
        });
        threadsa.forEach(async (t) => {
            let mem = interaction.guild.members.cache.get(t.ownerId);
            if (mem) {
                txt += `${t.name} | ${mem.user.username} | ${t.parentId}/${t.id}\n`;
            }
        });
        fs.writeFileSync('list.txt', txt, 'utf-8', (err) => {
            if (err) throw err;
            console.log('Utworzono plik');
        });

        const att = new AttachmentBuilder('list.txt');
        await interaction.followUp({ files: [att] }).then(() => {
            fs.unlinkSync('list.txt', (err) => {
                if (err) throw err;
                console.log('Plik usunięty')
            });
        }).catch(console.error);
    }
}

async function fetchAllArchivedThreads(channel, options) {
    let allThreads = [];
    let lastThread = null;
    while (true) {
        if (lastThread) options.before = lastThread;
        const threads = await channel.threads.fetchArchived(options);
        if (threads.threads.size === 0) break;

        threads.threads.forEach(thread => {
            allThreads.push(thread);
        })
        lastThread = threads.threads.lastKey();

        if (allThreads.length >= 1000) {
            console.log("Osiągnięto limit 1000 wątków. Przerywam pobieranie.");
            break;
        }
    }
    return allThreads;
}