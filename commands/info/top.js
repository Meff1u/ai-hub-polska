const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const memberdata = require('../../memberdata.json');
const {pagination, ButtonTypes, ButtonStyles} = require('@devraelfreeze/discordjs-pagination');

module.exports = {
    ephemeral: false,
    data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('Topka serwera w levelach.'),
    async execute(interaction) {
        let member = interaction.member;
        let leaderboard = [];
        memberdata.forEach(e => {
            let mem = interaction.guild.members.cache.get(e.id);
            if (mem) {
                leaderboard.push({ id: e.id, xp: e.level.xp + (e.level.lvl * 150) });
            }
        });
        await leaderboard.sort((a, b) => b.xp - a.xp);
        const slicedleaderboard = sliceArray(leaderboard, 10);

        const executerplace = leaderboard.findIndex(e => e.id === member.user.id) + 1;

        let pageid = 0;
        const embeds = slicedleaderboard.map((page) => {
            let desc = '';
            for (let i = 0; i < page.length; i++) {
                let mem = interaction.guild.members.cache.get(page[i].id);
                let memd = memberdata.find(m => m.id === page[i].id);
                desc += `\`${i + 1 + (pageid * 10)}.\` **${mem.user.username}** - ${memd.level.lvl} poziom (${memd.level.xp} XP)\n`;
            }
            const top = new EmbedBuilder().setTitle('AI Hub Polska Leaderboard').setDescription(desc).setColor('#ffffff').setThumbnail(interaction.guild.iconURL()).setFooter({ iconURL: member.user.displayAvatarURL(), text: `${member.user.username}, Twoje miejsce: ${executerplace}` });
            pageid += 1;
            return top;
        });

        /*
        let desc = '';
        for (let i = 0; i < leaderboard.length; i++) {
            let mem = interaction.guild.members.cache.get(leaderboard[i].id);
            let memd = memberdata.find(m => m.id === leaderboard[i].id)
            desc += `\`${i + 1}.\` **${mem.user.username}** - ${memd.level.lvl} poziom (${memd.level.xp} XP)\n`;
        }

        const top = new EmbedBuilder()
        .setTitle('AI Hub Polska Leaderboard')
        .setDescription(desc)
        .setColor('#ffffff')
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({ iconURL: member.user.displayAvatarURL(), text: `${member.user.username}, Twoje miejsce: ${executerplace}` });
        */
        // await interaction.followUp({ embeds: [top] });
        await pagination({
            embeds: embeds,
            author: interaction.member.user,
            interaction: interaction,
            ephemeral: false,
            time: 40000,
            disableButtons: true,
            fastSkip: false,
            pageTravel: false,
            buttons: [
                {
                    type: ButtonTypes.previous,
                    label: 'Poprzednia',
                    style: ButtonStyles.Primary
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