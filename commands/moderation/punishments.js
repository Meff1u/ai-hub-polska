const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const memberdata = require('../../memberdata.json');
const {pagination, ButtonTypes, ButtonStyles} = require('@devraelfreeze/discordjs-pagination');

module.exports = {
    id: '1136687318405758996',
    ephemeral: true,
    type: 'moderation',
    desc: 'Lista wszystkich kar użytkownika.',
    data: new SlashCommandBuilder()
    .setName('punishments')
    .setDescription('Lista wszystkich kar użytkownika.')
    .addUserOption(o => o
        .setName('user')
        .setDescription('Użytkownik, którego kary chcesz sprawdzić.')
        .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getMember('user');
        if (!memberdata.find(u => u.id === target.id)) memberdata.push({ id: target.id });
        const mtarget = memberdata.find(u => u.id === target.id);
        if (!mtarget.punishments || mtarget.punishments?.length < 1) return await interaction.followUp({ content: 'Ten użytkownik nie ma żadnych kar!' });
        const slicedpunishments = sliceArray(mtarget.punishments, 10);

        const generateEmbeds = async () => {
            const embeds = [];

            for (let i = 0; i < slicedpunishments.length; i++) {
                let punishdesc = '';
                const page = slicedpunishments[i];
                for (let l = 0; l < page.length; l++) {
                    punishdesc += `[${mtarget.punishments.length - (l + (i * 10))}] • **${page[l].type}** | Powód: \`${page[l].reason}\` | <@${page[l].by}>, <t:${Math.round(page[l].timestamp / 1000)}:R>\n`
                }
                const punishmentembed = new EmbedBuilder()
                .setAuthor({ name: `${target.user.username} - Wszystkie kary`, iconURL: target.user.displayAvatarURL() })
                .setDescription(punishdesc)
                .setTimestamp(Date.now())
                .setColor('#ffffff')
                .setFooter({ text: `Łącznie: ${mtarget.punishments.length}` });
                embeds.push(punishmentembed)
            }
            return embeds
        }

        const embeds = await generateEmbeds();

        await pagination({
            embeds: embeds,
            author: interaction.member.user,
            interaction: interaction,
            ephemeral: true,
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