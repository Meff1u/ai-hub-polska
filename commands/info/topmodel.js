const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {pagination, ButtonTypes, ButtonStyles} = require('@devraelfreeze/discordjs-pagination');
const canvafy = require("canvafy");

module.exports = {
    id: '1140440725843099698',
    ephemeral: false,
    type: 'info',
    desc: 'Topka serwera w zapostowanych modelach.',
    cooldown: 1,
    data: new SlashCommandBuilder()
    .setName('topmodel')
    .setDescription('Topka serwera w zapostowanych modelach.'),
    async execute(interaction) {
        let member = interaction.member;
        let leaderboard = [];
        const channel = await interaction.client.channels.fetch('1124570199018967075');
        const threads = await channel.threads.fetchActive();
        const archivedoptions = {
            fetchAll: true,
        };
        const threadsa = await fetchAllArchivedThreads(channel, archivedoptions)
        threads.threads.forEach(async (t) => {
            if (t.id === '1124571705738809425' || t.parentId !== '1124570199018967075') return;
            let mem = interaction.guild.members.cache.get(t.ownerId);
            if (mem) {
                let targetIndex = leaderboard.findIndex(i => i.id === t.ownerId);
                if (targetIndex !== -1) {
                    leaderboard[targetIndex].posts += 1;
                }
                else {
                    leaderboard.push({ id: t.ownerId, posts: 1 });
                }
            }
        });
        threadsa.forEach(async (t) => {
            if (t.id === '1124571705738809425' || t.parentId !== '1124570199018967075') return;
            let mem = interaction.guild.members.cache.get(t.ownerId);
            if (mem) {
                let targetIndex = leaderboard.findIndex(i => i.id === t.ownerId);
                if (targetIndex !== -1) {
                    leaderboard[targetIndex].posts += 1;
                }
                else {
                    leaderboard.push({ id: t.ownerId, posts: 1 });
                }
            }
        });
        await leaderboard.sort((a, b) => b.posts - a.posts);
        console.log(leaderboard);
        const slicedleaderboard = sliceArray(leaderboard, 10);

        const executerplace = leaderboard.findIndex(e => e.id === member.user.id) + 1;

        const imgch = await interaction.client.channels.fetch('1134180202050768907');

        const generateEmbeds = async () => {
            const embeds = [];
            length = slicedleaderboard.length > 10 ? 10 : slicedleaderboard.length;

            for (let i = 0; i < length; i++) {
                let userdataarr = [];
                const page = slicedleaderboard[i];
                for (let l = 0; l < page.length; l++) {
                    let mem = interaction.guild.members.cache.get(page[l].id);
                    userdataarr.push({ top: l + 1 + (i * 10), avatar: mem.user.displayAvatarURL(), tag: mem.user.username, score: page[l].posts });
                }
                const topatt = await new canvafy.Top()
                    .setOpacity(0.6)
                    .setScoreMessage('Modele:')
                    .setabbreviateNumber(false)
                    .setBackground("image", "https://img.freepik.com/free-vector/paper-style-gradient-blue-wavy-background_23-2149121741.jpg")
                    .setColors({ box: '#212121', username: '#ffffff', score: '#ffffff', firstRank: '#f7c716', secondRank: '#9e9e9e', thirdRank: '#94610f' })
                    .setUsersData(userdataarr)
                    .build();
                const m = await imgch.send({ files: [topatt] });
                const top = new EmbedBuilder().setTitle('AI Hub Polska Model Leaderboard').setColor('#ffffff').setThumbnail(interaction.guild.iconURL()).setFooter({ iconURL: member.user.displayAvatarURL(), text: `${member.user.username}, Twoje miejsce: ${executerplace}` }).setImage(m.attachments.first().url)
                embeds.push(top);
            }
            return embeds;
        }

        const embeds = await generateEmbeds();

        await pagination({
            embeds: embeds,
            author: interaction.member.user,
            interaction: interaction,
            ephemeral: false,
            time: 120000,
            disableButtons: true,
            fastSkip: false,
            pageTravel: true,
            buttons: [
                {
                    type: ButtonTypes.previous,
                    label: 'Poprzednia',
                    style: ButtonStyles.Primary
                },
                {
                    type: ButtonTypes.number,
                    label: 'Strona',
                    style: ButtonStyles.Secondary
                },
                {
                    type: ButtonTypes.next,
                    label: 'Następna',
                    style: ButtonStyles.Primary
                }
            ]
        });
    }
}

function sliceArray(array, length) {
    const slicedArray = [];
    
    for (let i = 0; i < array.length; i += length) {
      const podtablica = array.slice(i, i + length);
      slicedArray.push(podtablica);
    }
    
    return slicedArray;
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