const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const memberdata = require('../../memberdata.json');

module.exports = {
    ephemeral: false,
    data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('Topka serwera w levelach.'),
    async execute(interaction) {
        let member = interaction.member;
        let leaderboard = [];
        memberdata.forEach(e => {
            leaderboard.push({ id: e.id, xp: e.level.xp + (e.level.lvl * 150) });
        });
        leaderboard.sort((a, b) => b.xp - a.xp);

        const executerplace = leaderboard.findIndex(e => e.id === member.user.id) + 1;

        let desc = '';
        for (let i = 0; i < leaderboard.length; i++) {
            let mem = await interaction.guild.members.fetch(leaderboard[i].id);
            let memd = memberdata.find(m => m.id === leaderboard[i].id)
            desc += `\`${i + 1}.\` **${mem.user.username}** - ${memd.level.lvl} poziom (${memd.level.xp} XP)\n`;
        }

        const top = new EmbedBuilder()
        .setTitle('AI Hub Polska Leaderboard')
        .setDescription(desc)
        .setColor('#ffffff')
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({ iconURL: member.user.displayAvatarURL(), text: `${member.user.username}, Twoje miejsce: ${executerplace}` });

        await interaction.followUp({ embeds: [top] });
    }
}