const { Events, Collection, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
    
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            const { cmdcooldowns } = interaction.client;

            if (!cmdcooldowns.has(command.data.name)) {
                cmdcooldowns.set(command.data.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cmdcooldowns.get(command.data.name);
            const defaultCooldownDuration = 0;
            const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 60000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            
                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1000);
                    return interaction.reply({ content: `Tej komendy będziesz mógł użyć <t:${expiredTimestamp}:R>.`, ephemeral: true });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    
            if (command.ephemeral) {
                await interaction.deferReply({ ephemeral: true });
            }
            else {
                await interaction.deferReply();
            }
    
            try {
    
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'Error xd', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Error xd', ephemeral: true });
                }
            }
        }
        else if (interaction.isButton()) {
            if (interaction.customId === 'regaccept') {
                if (interaction.member.roles.cache.has('1136044660016554037')) return await interaction.reply({ content: 'Już zaakceptowałeś regulamin :)', ephemeral: true });
                const modal = new ModalBuilder().setCustomId('verify').setTitle('Potwierdź, że nie jesteś botem!');
                let n1 = randomInt(10); n2 = randomInt(10);
                interaction.client.captcha[interaction.member.id] = n1 + n2;
                const captcha = new TextInputBuilder().setCustomId('captcha').setLabel(`${n1} + ${n2}`).setStyle(TextInputStyle.Short).setPlaceholder('Podaj wynik powyższego działania...').setRequired(true).setMaxLength(2).setMinLength(1);
                const row = new ActionRowBuilder().addComponents(captcha);
                modal.addComponents(row);
                await interaction.showModal(modal);
            }
        }
        else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'verify') {
                if (interaction.client.captcha[interaction.member.id] == interaction.fields.getTextInputValue('captcha')) {
                    const role = await interaction.guild.roles.fetch('1136044660016554037');
                    await interaction.member.roles.add(role);
                    await interaction.reply({ content: 'Pomyślnie zweryfikowano! :)', ephemeral: true });
                }
                else {
                    await interaction.reply({ content: 'Nieprawidłowy wynik działania, spróbuj ponownie.', ephemeral: true });
                }
            }
        }
	},
};

function randomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}
