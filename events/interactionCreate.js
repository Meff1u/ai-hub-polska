const { Events, Collection } = require('discord.js');

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
	},
};