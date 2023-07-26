const { SlashCommandBuilder, AttachmentBuilder, } = require('discord.js');
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
        if (interaction.options.getUser('user')) member = interaction.options.getUser('user');
        const mmember = memberdata.find(m => m.id === member.id);
        if (!mmember) return await interaction.followUp(`Aby wyświetlić profil tej osoby musi ona coś napisać!`);

        const rank = new canvacord.Rank()
        .setAvatar(member.user.displayAvatarURL())
        .setCurrentXP(mmember.level.xp)
        .setRequiredXP(mmember.level.lvl * 150)
        .setLevel(mmember.level.lvl)
        .setStatus(member.user.presence?.status || 'offline')
        .setProgressBar(member.roles.highest?.hexColor, 'COLOR')
        .setUsername(member.user.username);

        rank.build().then(async data => {
            const att = new AttachmentBuilder(data, { name: `${member.user.username}.png`});
            await interaction.followUp({ files: [att] });
        });
    }
}