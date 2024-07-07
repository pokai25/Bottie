const { Permissions, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'promote',
    description: 'Assigns a rank to multiple users',
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
                .setDescription('- **Error**: Command input is invalid!\n- **Solution**: Please use the command in the following format: !rankup <@user1> <@user2> ... <rank>')
                .setTimestamp();

            return message.reply({ embeds: [usageEmbed] });
        }

        // Get the rank argument
        const rankArg = args[args.length - 1].toLowerCase();
        const rankID = assignableRoles[rankArg];
        if (!rankID) {
            const invalidRankEmbed = new EmbedBuilder()
                .setTitle('Error Code 1060')
                .setDescription('- **Error**: Invalid Rank executed!\n- **Solution**: Please execute the correct rank in order to give ranks to users!')
                .setColor('#58b9ff')
                .setTimestamp();

            return message.reply({ embeds: [invalidRankEmbed] });
        }

        // Get the mentioned users
        const userMentions = args.slice(0, -1);
        const users = userMentions.map(mention => message.mentions.users.get(mention.replace(/[<@!>]/g, ''))).filter(Boolean);

        if (users.length === 0) {
            const noUserMentionEmbed = new EmbedBuilder()
                .setTitle('Error Code 1062')
                .setDescription('- **Error**: No valid users mentioned!\n- **Solution**: Please mention valid users to assign the rank.')
                .setColor('#58b9ff')
                .setTimestamp();

            return message.reply({ embeds: [noUserMentionEmbed] });
        }

        const guild = message.guild;

        if (!guild) {
            const noServerEmbed = new EmbedBuilder()
                .setColor('#58b9ff')
                .setDescription('This command must be used in a server!');

            return message.reply({ embeds: [noServerEmbed] });
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
                .setDescription('- **Error**: You do not have permission to use this command!\n- **Solution**: You must have a valid ranking role to use this command!')
                .setColor('#58b9ff')
                .setTimestamp();

            return message.reply({ embeds: [noPermissionEmbed] });
        }

        // Process each user and accumulate results
        const successUsers = [];
        const failedUsers = [];

        const processUser = (user) => {
            return new Promise((resolve, reject) => {
                const member = guild.members.cache.get(user.id);
                if (!member) {
                    failedUsers.push(user.tag);
                    return resolve();
                }

                // Check if the member already has a rank role
                const currentRoleID = Object.values(assignableRoles).find(role => member.roles.cache.has(role));

                const updateRoles = () => {
                    if (currentRoleID) {
                        member.roles.remove(currentRoleID)
                            .then(() => {
                                member.roles.add(rankID)
                                    .then(() => {
                                        successUsers.push(user.tag);
                                        resolve();
                                    })
                                    .catch(error => {
                                        console.error('Failed to assign rank:', error);
                                        failedUsers.push(user.tag);
                                        resolve();
                                    });
                            })
                            .catch(error => {
                                console.error('Failed to remove current rank:', error);
                                failedUsers.push(user.tag);
                                resolve();
                            });
                    } else {
                        member.roles.add(rankID)
                            .then(() => {
                                successUsers.push(user.tag);
                                resolve();
                            })
                            .catch(error => {
                                console.error('Failed to assign rank:', error);
                                failedUsers.push(user.tag);
                                resolve();
                            });
                    }
                };

                updateRoles();
            });
        };

        // Process all users
        const userPromises = users.map(user => processUser(user));

        Promise.all(userPromises).then(() => {
            const successMessage = successUsers.length > 0 ? `- **Success**: Successfully added ${rankArg} role to ${successUsers.join(', ')}.\n` : '';
            const failureMessage = failedUsers.length > 0 ? `- **Error**: Failed to assign ${rankArg} role to ${failedUsers.join(', ')}.\n` : '';
            const combinedMessage = `${successMessage}${failureMessage}`;

            const resultEmbed = new EmbedBuilder()
                .setTitle('Rank Assignment Results')
                .setDescription(`${combinedMessage}- **Bug**: Code 1058`)
                .setColor(successUsers.length > 0 ? '#58b9ff' : '#58b9ff')
                .setTimestamp();

            message.reply({ embeds: [resultEmbed] });
        });
    },
};
