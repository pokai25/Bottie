const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'recruit',
    description: 'Recruits users by removing one role and adding another',
    execute(message, args) {
        // IDs for the roles to remove and add
        const roleToRemoveID = '1251367866738151505';
        const roleToAddID = '1248815969481134143';

        // Check if the command was used correctly
        if (args.length < 1) {
            const usageEmbed = new EmbedBuilder()
                .setTitle('Error Code 1068')
                .setColor('#212121')
                .setDescription('- **Error**: Command input is invalid!\n- **Solution**: Please use the command in the following format: !recruit <@user1> <@user2> ...')
                .setTimestamp();

            return message.reply({ embeds: [usageEmbed] });
        }

        // Get the mentioned users
        const mentionedUsers = message.mentions.users;

        if (mentionedUsers.size === 0) {
            const noUserMentionEmbed = new EmbedBuilder()
                .setTitle('Error Code 1069')
                .setDescription('- **Error**: No valid users mentioned!\n- **Solution**: Please mention valid users to recruit.')
                .setColor('#212121')
                .setTimestamp();

            return message.reply({ embeds: [noUserMentionEmbed] });
        }

        const guild = message.guild;

        if (!guild) {
            const noServerEmbed = new EmbedBuilder()
                .setColor('#212121')
                .setDescription('This command must be used in a server!');

            return message.reply({ embeds: [noServerEmbed] });
        }

        let successUsers = [];
        let errorUsers = [];
        let guestRoleNotFoundUsers = [];

        // Process each mentioned user
        mentionedUsers.forEach(user => {
            const member = guild.members.cache.get(user.id);

            if (!member) {
                errorUsers.push(user.tag);
                return;
            }

            if (!member.roles.cache.has(roleToRemoveID)) {
                guestRoleNotFoundUsers.push(user.tag);
                return;
            }

            member.roles.remove(roleToRemoveID)
                .then(() => {
                    member.roles.add(roleToAddID)
                        .then(() => {
                            successUsers.push(user.tag);
                        })
                        .catch(error => {
                            console.error('Failed to add the new role:', error);
                            errorUsers.push(user.tag);
                        });
                })
                .catch(error => {
                    console.error('Failed to remove the old role:', error);
                    errorUsers.push(user.tag);
                });
        });

        // Send the success message after processing all users
        setTimeout(() => {
            if (successUsers.length > 0) {
                const successEmbed = new EmbedBuilder()
                    .setTitle('Recruitment Successful')
                    .setDescription(`- **Success**: Successfully recruited the following users by removing the old role and adding the new role: ${successUsers.join(', ')}`)
                    .setColor('#212121')
                    .setTimestamp();

                message.reply({ embeds: [successEmbed] });
            }

            if (guestRoleNotFoundUsers.length > 0) {
                const guestRoleNotFoundEmbed = new EmbedBuilder()
                    .setTitle('Error Code 1070')
                    .setDescription(`- **Error**: The following users do not have the guest role: ${guestRoleNotFoundUsers.join(', ')}.`)
                    .setColor('#212121')
                    .setTimestamp();

                message.reply({ embeds: [guestRoleNotFoundEmbed] });
            }

            if (errorUsers.length > 0) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Recruitment Errors')
                    .setDescription(`- **Error**: Failed to recruit the following users: ${errorUsers.join(', ')}. Please ensure the bot has the appropriate permissions and try again.`)
                    .setColor('#212121')
                    .setTimestamp();

                message.reply({ embeds: [errorEmbed] });
            }
        }, 1000); // Wait for 1 second to ensure all operations are complete
    },
};
