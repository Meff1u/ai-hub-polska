const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, } = require('discord.js');
const canvacord = require('canvacord');
const memberdata = require('../../memberdata.json');

module.exports = {
    ephemeral: false,
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
        const threads = await channel.threads.fetch();
        const postedmodels = threads.threads.filter(post => {
            if (post.ownerId === member.user.id) return true;
            return false;
        });

        let leaderboard = [];
        memberdata.forEach(e => {
            leaderboard.push({ id: e.id, xp: e.level.xp + (e.level.lvl * 150) });
        });
        leaderboard.sort((a, b) => b.xp - a.xp);
        const rankplace = leaderboard.findIndex(e => e.id === member.user.id) + 1;

        const rank = new canvacord.Rank()
        .setAvatar(member.user.displayAvatarURL())
        .setCurrentXP(mmember.level.xp)
        .setRequiredXP(mmember.level.lvl * 150)
        .setLevel(mmember.level.lvl)
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
                    { name: 'Statystyki:', value: `• Wiadomości: **${mmember.messages || '0'}**\n• Zapostowane modele: **${postedmodels.size}**`, inline: true }
                )
                .setImage(m.attachments.first().url);
                await interaction.followUp({ embeds: [e] });
            });
        });
    }
}