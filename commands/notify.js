const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'notify',
    description: 'Sends a notification message and an embed to a specified channel',
    execute(message, args) {
        // Check if there are enough arguments
        if (args.length < 1) {
            const usageEmbed = new EmbedBuilder()
                .setTitle('Error Code 1064')
                .setColor('#212121')
                .setDescription('- **Error**: Command input is invalid!\n- **Solution**: Please use the command in the following format: `!notify #channel` followed by the messages')
                .setTimestamp();

            return message.reply({ embeds: [usageEmbed] });
        }

        // Extract the channel mention
        const channelMention = args.shift();
        const channelID = channelMention.match(/^<#(\d+)>$/);

        if (!channelID) {
            const invalidChannelEmbed = new EmbedBuilder()
                .setTitle('Error Code 1065')
                .setColor('#212121')
                .setDescription('- **Error**: Invalid channel mention!\n- **Solution**: Please mention a valid channel.')
                .setTimestamp();

            return message.reply({ embeds: [invalidChannelEmbed] });
        }

        // Find the channel by ID
        const channel = message.guild.channels.cache.get(channelID[1]);
        if (!channel) {
            const invalidChannelEmbed = new EmbedBuilder()
                .setTitle('Error Code 1065')
                .setColor('#212121')
                .setDescription('- **Error**: Invalid channel ID!\n- **Solution**: Please provide a valid channel ID.')
                .setTimestamp();

            return message.reply({ embeds: [invalidChannelEmbed] });
        }

        // Extract the message lines
        const lines = message.content.split('\n').slice(1);
        if (lines.length < 1) {
            const invalidFormatEmbed = new EmbedBuilder()
                .setTitle('Error Code 1066')
                .setColor('#212121')
                .setDescription('- **Error**: Invalid message format!\n- **Solution**: Please ensure the message follows the correct format with at least 1 line.')
                .setTimestamp();

            return message.reply({ embeds: [invalidFormatEmbed] });
        }

        // Identify sections
        let normalMessage = '';
        let title = '';
        let description = '';
        let footer = '';

        let section = 'normalMessage';
        lines.forEach(line => {
            if (line.trim() === '') {
                if (section === 'normalMessage') section = 'title';
                else if (section === 'title') section = 'description';
                else if (section === 'description') section = 'footer';
            } else {
                if (section === 'normalMessage') normalMessage += line.trim() + '\n';
                else if (section === 'title') title += line.trim() + '\n';
                else if (section === 'description') description += line.trim() + '\n';
                else if (section === 'footer') footer += line.trim() + '\n';
            }
        });

        normalMessage = normalMessage.trim();
        title = title.trim();
        description = description.trim();
        footer = footer.trim();

        // Send the normal message if present
        const sendEmbed = () => {
            if (title || description || footer) {
                const embed = new EmbedBuilder()
                    .setTitle(title || 'No Title')
                    .setDescription(description || 'No Description')
                    .setFooter({ text: footer || 'Unknown' })
                    .setColor('#212121')
                    .setTimestamp();

                channel.send({ embeds: [embed] })
                    .then(() => {
                        const successEmbed = new EmbedBuilder()
                            .setTitle('Notification Sent')
                            .setColor('#212121')
                            .setDescription(`Successfully sent the message${normalMessage ? ' and embed' : ''} to ${channelMention}`)
                            .setTimestamp();

                        message.reply({ embeds: [successEmbed] });
                    })
                    .catch(error => {
                        console.error('Failed to send embed:', error);
                        const errorEmbed = new EmbedBuilder()
                            .setTitle('Error')
                            .setColor('#212121')
                            .setDescription('Failed to send the embed! Please ensure the bot has permission to send messages in the specified channel.')
                            .setTimestamp();

                        message.reply({ embeds: [errorEmbed] });
                    });
            } else {
                const successEmbed = new EmbedBuilder()
                    .setTitle('Notification Sent')
                    .setColor('#212121')
                    .setDescription(`Successfully sent the message to ${channelMention}`)
                    .setTimestamp();

                message.reply({ embeds: [successEmbed] });
            }
        };

        if (normalMessage) {
            channel.send(normalMessage)
                .then(() => {
                    sendEmbed();
                })
                .catch(error => {
                    console.error('Failed to send message:', error);
                    const errorEmbed = new EmbedBuilder()
                        .setTitle('Error')
                        .setColor('#212121')
                        .setDescription('Failed to send the message! Please ensure the bot has permission to send messages in the specified channel.')
                        .setTimestamp();

                    message.reply({ embeds: [errorEmbed] });
                });
        } else {
            sendEmbed();
        }
    },
};
