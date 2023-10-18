const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, } = require('discord.js');
const canvacord = require('canvacord');
const memberdata = require('../../memberdata.json');

module.exports = {
    id: '1133843325456232599',
    ephemeral: false,
    type: 'info',
    desc: 'Statystyki i informacje o profilu.',
    data: new SlashCommandBuilder()
    .setName('profil')
    .setDescription('Statystyki i informacje o profilu')
    .addUserOption(o => o
        .setName('user')
        .setDescription('Wybierz użytkownika, którego profil chcesz sprawdzić.')
        .setRequired(false)),
    async execute(interaction) {
        let member = interaction.member;
        if (interaction.options.getUser('user')) member = interaction.guild.members.cache.get(interaction.options.getUser('user').id);
        const mmember = memberdata.find(m => m.id === member.id);
        if (!mmember) return await interaction.followUp(`Aby wyświetlić profil tej osoby musi ona coś napisać!`);

        const channel = await interaction.client.channels.fetch('1124570199018967075');
        const threads = await channel.threads.fetchActive();
        const archivedoptions = {
            fetchAll: true,
        };
        const threadsa = await fetchAllArchivedThreads(channel, archivedoptions);
        const postedmodels = threads.threads.filter(post => {
            if (post.ownerId === member.user.id && post.parentId === '1124570199018967075') return true;
            return false;
        });
        const postedmodelsa = threadsa.filter(post => {
            if (post.ownerId === member.user.id && post.parentId === '1124570199018967075') return true;
            return false;
        });
        const finalposted = postedmodels.size + postedmodelsa.length;

        let leaderboard = [];
        memberdata.forEach(e => {
            let mem = interaction.guild.members.cache.get(e.id);
            if (mem) {
                let xp = e.level?.xp ? e.level.xp : 0;
                let lvl = e.level?.lvl ? e.level.lvl : 1;
                leaderboard.push({ id: e.id, xp: xp + (((lvl * (lvl + 1))/2) * 150) });
            }
        });
        leaderboard.sort((a, b) => b.xp - a.xp);
        const rankplace = leaderboard.findIndex(e => e.id === member.user.id) + 1;

        const rank = new canvacord.Rank()
        .setAvatar(member.user.displayAvatarURL())
        .setCurrentXP(mmember.level?.xp || 0)
        .setRequiredXP(mmember.level?.lvl * 150 || 150)
        .setLevel(mmember.level?.lvl || 1)
        .setStatus(member.user.presence?.status || 'offline')
        .setProgressBar(member.roles.highest?.hexColor, 'COLOR')
        .setUsername(member.user.username)
        .setRank(rankplace);

        rank.build().then(async data => {
            const att = new AttachmentBuilder(data, { name: `${member.user.username}.png`});
            const imgch = await interaction.client.channels.fetch('1134180202050768907');
            imgch.send({ files: [att] }).then(async (m) => {
                const e = new EmbedBuilder()
                .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })
                .setColor(member.roles.highest?.hexColor)
                .addFields(
                    { name: 'Informacje:', value: `• ID: **${member.user.id}**\n• Utworzył(a) konto **<t:${Math.round(member.user.createdTimestamp / 1000)}:R>**\n• Dołączył(a) na serwer **<t:${Math.round(member.joinedTimestamp / 1000)}:R>**`, inline: true },
                    { name: 'Statystyki:', value: `• Wiadomości: **${mmember.messages || '0'}**\n• Zapostowane modele: **${finalposted}**`, inline: true }
                )
                .setImage(m.attachments.first().url);
                await interaction.followUp({ embeds: [e] });
            });
        });
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