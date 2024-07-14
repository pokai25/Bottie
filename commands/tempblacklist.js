const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'tempblacklist',
    description: 'Temporarily blacklists a user',
    async execute(message, args) {
        const requiredRoleId = '1258806351849721996';
        const blacklistRoleId = '1260919377407119423';
        const logChannelId = '1252431615918084096';

        // Check if the author has the required role
        if (!message.member.roles.cache.has(requiredRoleId)) {
            const noPermissionEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('You do not have the required role to execute this command.')
                .setColor('#58b9ff')
                .setTimestamp();
            return message.reply({ embeds: [noPermissionEmbed] });
        }

        // Check if user is mentioned
        const mentionedUser = message.mentions.users.first();
        if (!mentionedUser) {
            const noUserEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('Please mention a user to blacklist.')
                .setColor('#58b9ff')
                .setTimestamp();
            return message.reply({ embeds: [noUserEmbed] });
        }

        // Extract reason, days, and proof from args
        const reasonIndex = args.indexOf(mentionedUser.toString()) + 1;
        const reason = args[reasonIndex];
        const days = parseInt(args[reasonIndex + 1]);
        const proof = args.slice(reasonIndex + 2).join(' ');

        if (isNaN(days)) {
            const invalidDaysEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('Please specify a valid number of days.')
                .setColor('#58b9ff')
                .setTimestamp();
            return message.reply({ embeds: [invalidDaysEmbed] });
        }

        let proofText;
        let proofImage;

        // Check if proof is a URL (assuming it's an image)
        const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
        if (urlPattern.test(proof)) {
            proofImage = proof;
            proofText = null;
        } else {
            proofText = proof;
        }

        // Fetch the guild member
        const guildMember = message.guild.members.cache.get(mentionedUser.id);
        if (!guildMember) {
            const noGuildMemberEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('The mentioned user is not a member of this server.')
                .setColor('#58b9ff')
                .setTimestamp();
            return message.reply({ embeds: [noGuildMemberEmbed] });
        }

        // Assign the blacklist role
        await guildMember.roles.add(blacklistRoleId);

        // Create the embed message
        const blacklistEmbed = new EmbedBuilder()
            .setTitle('**🛡️ Temporarily Blacklisted**')
            .setDescription(`
- **User**: ${mentionedUser}
- **Blacklist**: ${days} days
- **Proof**: ${proofText ? proofText : ''}
            `)
            .setColor('#58b9ff')
            .setFooter({ text: `By ${message.author.tag}` })
            .setTimestamp()
            .setThumbnail(mentionedUser.displayAvatarURL());

        if (proofImage) {
            blacklistEmbed.setImage(proofImage);
        }

        // Send the embed to the log channel
        const logChannel = message.guild.channels.cache.get(logChannelId);
        if (logChannel) {
            logChannel.send({ embeds: [blacklistEmbed] });
        }

        // Confirm the blacklist to the command executor
        message.reply({ embeds: [blacklistEmbed] });

        // Handle removing the blacklist role after the specified number of days
        setTimeout(async () => {
            await guildMember.roles.remove(blacklistRoleId);
            const unblacklistEmbed = new EmbedBuilder()
                .setTitle('Blacklist Expired')
                .setDescription(`${mentionedUser} is no longer blacklisted.`)
                .setColor('#58b9ff')
                .setTimestamp();
            if (logChannel) {
                logChannel.send({ embeds: [unblacklistEmbed] });
            }
        }, days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
    },
};
