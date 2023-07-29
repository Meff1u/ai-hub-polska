const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const memberdata = require('../../memberdata.json');
const {pagination, ButtonTypes, ButtonStyles} = require('@devraelfreeze/discordjs-pagination');
const canvafy = require("canvafy");

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

        const generateEmbeds = async () => {
            let pageid = 0;
            const embeds = await Promise.all(slicedleaderboard.map(async (page) => {
                console.log(pageid);
                let userdataarr = [];
                for (let i = 0; i < page.length; i++) {
                    let mem = interaction.guild.members.cache.get(page[i].id);
                    let memd = memberdata.find(m => m.id === page[i].id);
                    userdataarr.push({ top: i + 1 + (pageid * 10), avatar: mem.user.displayAvatarURL(), tag: mem.user.username, score: memd.level.lvl });
                }
                const topatt = await new canvafy.Top()
                    .setOpacity(0.6)
                    .setScoreMessage('Poziom:')
                    .setabbreviateNumber(false)
                    .setBackground("image", "https://img.freepik.com/free-vector/paper-style-gradient-blue-wavy-background_23-2149121741.jpg")
                    .setColors({ box: '#212121', username: '#ffffff', score: '#ffffff', firstRank: '#f7c716', secondRank: '#9e9e9e', thirdRank: '#94610f' })
                    .setUsersData(userdataarr)
                    .build();
                const imgch = await interaction.client.channels.fetch('1134180202050768907');
                const top = new EmbedBuilder().setTitle('AI Hub Polska Leaderboard').setColor('#ffffff').setThumbnail(interaction.guild.iconURL()).setFooter({ iconURL: member.user.displayAvatarURL(), text: `${member.user.username}, Twoje miejsce: ${executerplace}` });
                await imgch.send({ files: [topatt] }).then(async (m) => {
                    top.setImage(m.attachments.first().url);
                    pageid += 1;
                });
                return top;
            }));
            return embeds;
        }

        const embeds = await generateEmbeds();

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