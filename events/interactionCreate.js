const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
    
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
    
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