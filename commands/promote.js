const { Permissions, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'promote',
    description: 'Assigns a rank to a user',
    execute(message, args) {
        // Role IDs for each level
        const levelRoleIDs = {
            level1: '1258770431331012659',
            level2: '1258770333486288979',
            level3: '1258770232835833856',
            level4: '1258770336862830716'
        };

        // Rank roles that can be assigned by each level
        const assignableRoles = {
            private: '1248818417499373638',
            lancecorporal: '1248818393146986497',
            corporal: '1248818392681680908',
            sergeant: '1248818391805067264',
            major: '1248815965924491294',
        };

        // Check if the command was used correctly
        if (args.length < 2) {
            const usageEmbed = new EmbedBuilder()
                .setTitle('Error Code 1059')
                .setColor('#58b9ff')
                .setDescription('- **Error** : Command input is invalid!\n- **Solution** : Please use the command in the following format : !rankup <@user> <rank>')
                .setTimestamp();

            return message.reply({ embeds: [usageEmbed] });
        }

        // Get the mentioned user
        const user = message.mentions.users.first();
        if (!user) {
            const noUserMentionEmbed = new EmbedBuilder()
                .setTitle('Error Code 1062')
                .setDescription('- **Error** : No valid user mentioned!\n- **Solution** : Please mention a valid user to assign the rank.')
                .setColor('#58b9ff')
                .setTimestamp();

            return message.reply({ embeds: [noUserMentionEmbed] });
        }

        const rankArg = args[1].toLowerCase();
        const rankID = assignableRoles[rankArg];
        if (!rankID) {
            const invalidRankEmbed = new EmbedBuilder()
                .setTitle('Error Code 1060')
                .setDescription('- **Error** : Invalid Rank executed!\n- **Solution** : Please execute the correct rank in order to give ranks to users!')
                .setColor('#58b9ff')
                .setTimestamp();

            return message.reply({ embeds: [invalidRankEmbed] });
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

        // Determine the highest level role the message author has
        let authorLevel = null;
        for (const [level, roleID] of Object.entries(levelRoleIDs)) {
            if (message.member.roles.cache.has(roleID)) {
                authorLevel = level;
                break;
            }
        }

        if (!authorLevel) {
            const noPermissionEmbed = new EmbedBuilder()
                .setTitle('Error Code 1056')
                .setDescription('- **Error** : You do not have permission to use this command!\n- **Solution** : You must have a valid ranking role to use this command!')
                .setColor('#58b9ff')
                .setTimestamp();

            return message.reply({ embeds: [noPermissionEmbed] });
        }

        // Check if the member already has a rank role
        const currentRoleID = Object.values(assignableRoles).find(role => member.roles.cache.has(role));
        if (currentRoleID) {
            // Remove the current role before assigning a new one
            member.roles.remove(currentRoleID)
                .then(() => {
                    // Add the new rank role to the member
                    member.roles.add(rankID)
                        .then(() => {
                            const successEmbed = new EmbedBuilder()
                                .setTitle('Rank Assigned')
                                .setDescription(`- **Success** : Successfully added ${rankArg} role to ${user.tag}!\n- **Bug** : Code 1058`)
                                .setColor('#58b9ff')
                                .setTimestamp();

                            message.reply({ embeds: [successEmbed] });
                        })
                        .catch(error => {
                            console.error('Failed to assign rank:', error);
                            const errorEmbed = new EmbedBuilder()
                                .setTitle('Error Code 1063')
                                .setDescription('- **Error** : The bot encountered an error while attempting to add the roles you specified.\n- **Solution** : Please contact the staff members as well as the developers.')

                            message.reply({ embeds: [errorEmbed] });
                        });
                })
                .catch(error => {
                    console.error('Failed to remove current rank:', error);
                    const errorEmbed = new EmbedBuilder()
                        .setTitle('Error Code 1063')
                        .setDescription('- **Error** : The bot encountered an error while attempting to add the roles you specified.\n- **Solution** : Please contact the staff members as well as the developers.')
                        .setColor('#58b9ff')
                        .setTimestamp();

                    message.reply({ embeds: [errorEmbed] });
                });
        } else {
            // Add the new rank role to the member directly
            member.roles.add(rankID)
                .then(() => {
                    const successEmbed = new EmbedBuilder()
                        .setTitle('Rank Assigned')
                        .setDescription(`- **Success** : Successfully added ${rankArg} role to ${user.tag}!\n- **Bug** : Code 1058`)
                        .setColor('#58b9ff')
                        .setTimestamp();

                    message.reply({ embeds: [successEmbed] });
                })
                .catch(error => {
                    console.error('Failed to assign rank:', error);
                    const errorEmbed = new EmbedBuilder()
                        .setTitle('Error Code 1063')
                        .setDescription('- **Error** : The bot encountered an error while attempting to add the roles you specified.\n- **Solution** : Please contact the staff members as well as the developers.')
                        .setColor('#58b9ff')
                        .setTimestamp();

                    message.reply({ embeds: [errorEmbed] });
                });
        }
    },
};
