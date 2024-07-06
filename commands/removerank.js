const { Permissions, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'removerank',
    description: 'Removes a rank from a user',
    execute(message, args) {
        // Role ID that is allowed to use this command
        const allowedRoleID = '1258806351849721996';

        // Check permissions
        if (!message.member.roles.cache.has(allowedRoleID)) {
            const noPermissionEmbed = new EmbedBuilder()
                .setTitle('Error Code 1056')
                .setDescription('- **Error** : You do not have permission to use this command!\n- **Solution** : You must have Ranking Perms in order to use this command!')
                .setColor('#58b9ff')
                .setTimestamp();

            return message.reply({ embeds: [noPermissionEmbed] });
        }

        // Check if the command was used correctly
        if (args.length < 1) {
            const usageEmbed = new EmbedBuilder()
                .setTitle('Error Code 1059')
                .setColor('#58b9ff')
                .setDescription('- **Error** : Command input is invalid!\n- **Solution** : Please use the command in the following format : !removerank <@user>')
                .setTimestamp();

            return message.reply({ embeds: [usageEmbed] });
        }

        // Get the mentioned user
        const user = message.mentions.users.first();
        if (!user) {
            const noUserMentionEmbed = new EmbedBuilder()
                .setTitle('Error Code 1062')
                .setDescription('- **Error** : No valid user mentioned!\n- **Solution** : Please mention a valid user to remove the rank.')
                .setColor('#58b9ff')
                .setTimestamp();

            return message.reply({ embeds: [noUserMentionEmbed] });
        }

        const guild = message.guild;

        if (!guild) {
            const noServerEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription('This command must be used in a server!');

            return message.reply({ embeds: [noServerEmbed] });
        }

        // Get the member object
        const member = guild.members.cache.get(user.id);
        if (!member) {
            const memberNotFoundEmbed = new EmbedBuilder()
                .setTitle('Error Code 1058')
                .setDescription('- **Error** : Member not found in the server!\n- **Solution** : Please input and execute the correct username!')
                .setColor('#58b9ff')
                .setTimestamp();

            return message.reply({ embeds: [memberNotFoundEmbed] });
        }

        // Define role IDs for each level
        const roleIDs = {
            level1: '1258770431331012659',
            level2: '1258770333486288979',
            level3: '1258770232835833856',
            level4: '1258770336862830716'
        };

        // Filter the roles the member has to check for any level roles
        const levelRoleIDs = Object.values(roleIDs);
        const rolesToRemove = member.roles.cache.filter(r => levelRoleIDs.includes(r.id));

        if (rolesToRemove.size === 0) {
            const noLevelRolesEmbed = new EmbedBuilder()
                .setTitle('Error Code 1063')
                .setDescription('- **Error** : The user does not have any level roles!\n- **Solution** : Please make sure the user has a level role before attempting to remove it.')
                .setColor('#58b9ff')
                .setTimestamp();

            return message.reply({ embeds: [noLevelRolesEmbed] });
        }

        // Remove the level roles from the member
        member.roles.remove(rolesToRemove)
            .then(() => {
                const successEmbed = new EmbedBuilder()
                    .setTitle('Rank Removed')
                    .setDescription(`- **Success** : Successfully removed level role(s) from ${user.tag}!\n- **Bug** : Code 1058`)
                    .setColor('#58b9ff')
                    .setTimestamp();

                message.reply({ embeds: [successEmbed] });
            })
            .catch(error => {
                console.error('Failed to remove role:', error);
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error Code 1063')
                    .setDescription('- **Error** : The bot encountered an error while attempting to remove the role.\n- **Solution** : Please contact the staff members as well as the developers.')
                    .setColor('#ff0000')
                    .setTimestamp();

                message.reply({ embeds: [errorEmbed] });
            });
    },
};
