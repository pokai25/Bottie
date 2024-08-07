const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'test',
    description: 'Sends a test embed',
    execute(message, args) {
        const testEmbed = new EmbedBuilder()
            .setTitle('Test')
            .setDescription('This is a test message.')
            .setColor('#212121'); // Set your desired color here

        message.reply({ embeds: [testEmbed] });
    },
};
