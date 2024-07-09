const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'host',
    description: 'Schedules an event: raid or training.',
    async execute(message, args) {
        // Check if the member has the required role
        const requiredRoleId = '1260199049202761858'; // Role ID to check
        if (!message.member.roles.cache.has(requiredRoleId)) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Permission Denied')
                .setColor('#FF0000')
                .setDescription('You do not have permission to use this command.')
                .setTimestamp();

            return message.reply({ embeds: [errorEmbed] });
        }

        // Check if there are enough arguments
        if (args.length < 3) {
            const usageEmbed = new EmbedBuilder()
                .setTitle('Error Code 1064')
                .setColor('#58b9ff')
                .setDescription('- **Error**: Command input is invalid!\n- **Solution**: Please use the command in the following format: `!schedule #channel raid/training [LINK]`.')
                .setTimestamp();

            return message.reply({ embeds: [usageEmbed] });
        }

        // Extract the channel mention, event type, and link
        const channelMention = args.shift();
        const eventType = args.shift().toLowerCase();
        const link = args.shift();
        const channelID = channelMention.match(/^<#(\d+)>$/);

        // Validate the channel mention
        if (!channelID) {
            const invalidChannelEmbed = new EmbedBuilder()
                .setTitle('Error Code 1065')
                .setColor('#58b9ff')
                .setDescription('- **Error**: Invalid channel mention!\n- **Solution**: Please mention a valid channel.')
                .setTimestamp();

            return message.reply({ embeds: [invalidChannelEmbed] });
        }

        // Validate the link
        const validLink = /^(https?:\/\/)?(www\.)?(roblox\.com\/|roblox\.com$)/i;
        if (!validLink.test(link)) {
            const invalidLinkEmbed = new EmbedBuilder()
                .setTitle('Error Code 1067')
                .setColor('#58b9ff')
                .setDescription('- **Error**: Invalid link!\n- **Solution**: The link must be a valid URL from "www.roblox.com" or "roblox.com".')
                .setTimestamp();

            return message.reply({ embeds: [invalidLinkEmbed] });
        }

        // Find the channel by ID
        const channel = message.guild.channels.cache.get(channelID[1]);
        if (!channel) {
            const invalidChannelEmbed = new EmbedBuilder()
                .setTitle('Error Code 1065')
                .setColor('#58b9ff')
                .setDescription('- **Error**: Invalid channel ID!\n- **Solution**: Please provide a valid channel ID.')
                .setTimestamp();

            return message.reply({ embeds: [invalidChannelEmbed] });
        }

        // Prepare the embed and button based on the event type
        let embed, button;
        if (eventType === 'raid') {
            embed = new EmbedBuilder()
                .setTitle('**⚔️ RAID**')
                .setDescription('\nA raid has begun in the game! Join us and participate to earn 1 point or more, based on your performance, if you stay until the end.\n')
                .setFooter({ text: `Scheduled by ${message.author.tag}` })
                .setColor('#58b9ff')
                .setImage('https://cdn.discordapp.com/attachments/1258742384842510406/1260196781476810835/Commands_6.png?ex=668e7136&is=668d1fb6&hm=58f4c2757280cfe586b825ce4d6b66ad00cb539e4a4584c41acb90a5d80a96fc&')
                .setTimestamp();

            button = new ButtonBuilder()
                .setLabel('Join')
                .setStyle(ButtonStyle.Link)
                .setURL(link);
        } else if (eventType === 'training') {
            embed = new EmbedBuilder()
                .setTitle('**🎯 TRAINING**')
                .setDescription('\nJoin our training session to enhance your skills. You will earn 1 point if you complete the session until the end.\n')
                .setFooter({ text: `Scheduled by ${message.author.tag}` })
                .setColor('#58b9ff')
                .setTimestamp()
                .setImage('https://cdn.discordapp.com/attachments/1258742384842510406/1260196781224890368/Commands_7.png?ex=668e7135&is=668d1fb5&hm=3c9b3a8c59052a917e4d01fb87cfba2962c701273fb095f46110fb8072abcbc0&');

            button = new ButtonBuilder()
                .setLabel('Join')
                .setStyle(ButtonStyle.Link)
                .setURL(link);
        } else {
            const invalidEventEmbed = new EmbedBuilder()
                .setTitle('Error Code 1066')
                .setColor('#58b9ff')
                .setDescription('- **Error**: Invalid event type specified!\n- **Solution**: Use `raid` or `training`.')
                .setTimestamp();

            return message.reply({ embeds: [invalidEventEmbed] });
        }

        const row = new ActionRowBuilder().addComponents(button);

        // Send the embed and button
        try {
            await channel.send({ embeds: [embed], components: [row] });
            const successEmbed = new EmbedBuilder()
                .setTitle('Event Scheduled')
                .setColor('#58b9ff')
                .setDescription(`Successfully scheduled the ${eventType} event in ${channelMention}`)
                .setTimestamp();

            message.reply({ embeds: [successEmbed] });
        } catch (error) {
            console.error('Failed to send message:', error);
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setColor('#FF0000')
                .setDescription('Failed to schedule the event! Please ensure the bot has permission to send messages in the specified channel.')
                .setTimestamp();

            message.reply({ embeds: [errorEmbed] });
        }
    }
};
