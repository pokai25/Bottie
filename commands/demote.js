const { Permissions, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'demote',
    description: 'Assigns a rank to multiple users',
    execute(message, args) {
        // Role IDs for each rank
        const rankRoles = {
            Private: '1248818417499373638',
            'Lance-Corporal': '1248818393146986497',
            Corporal: '1248818392681680908',
            Sergeant: '1248818391805067264',
            'Chef-Sergeant': '1248818391024799804',
            'Warrant-Officer': '1248815968885538816',
            Lieutenant: '1248819920595189862',
            Pathfinder: '1248815967262212176',
            Captain: '1248815966263967787',
            'Field-Major': '1248815965924491294',
            Colonel: '1248815965580558418',
            'Brigadier-Sovereign': '1248815964620066856',
            'Field-Marshal': '1248815960966823978'
        };

        // Rank hierarchy
        const rankHierarchy = [
            'Field-Marshal',
            'Brigadier-Sovereign',
            'Colonel',
            'Field-Major',
            'Captain',
            'Pathfinder',
            'Lieutenant',
            'Warrant-Officer',
            'Chef-Sergeant',
            'Sergeant',
            'Corporal',
            'Lance-Corporal',
            'Private'
        ];

        // Role levels
        const levelRoles = {
            level1: '1258770431331012659',
            level2: '1258770333486288979',
            level3: '1258770232835833856',
            level4: '1258770336862830716'
        };

        // Check if the command was used correctly
        if (args.length < 2) {
            const usageEmbed = new EmbedBuilder()
                .setTitle('Error Code 1059')
                .setColor('#212121')
                .setDescription('- **Error**: Command input is invalid!\n- **Solution**: Please use the command in the following format: !demote <@user1> <@user2> ... <rank>')
                .setTimestamp();

            return message.reply({ embeds: [usageEmbed] });
        }

        // Get the rank argument
        const rankArg = args[args.length - 1];
        const rankID = rankRoles[rankArg];
        if (!rankID) {
            const invalidRankEmbed = new EmbedBuilder()
                .setTitle('Error Code 1060')
                .setDescription('- **Error**: Invalid Rank executed!\n- **Solution**: Please execute the correct rank in order to give ranks to users!')
                .setColor('#212121')
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

        // Determine the highest level role the message author has
        let authorLevel = -1;
        if (message.member.roles.cache.has(levelRoles.level4)) {
            authorLevel = 4;
        } else if (message.member.roles.cache.has(levelRoles.level3)) {
            authorLevel = 3;
        } else if (message.member.roles.cache.has(levelRoles.level2)) {
            authorLevel = 2;
        } else if (message.member.roles.cache.has(levelRoles.level1)) {
            authorLevel = 1;
        }

        if (authorLevel === -1) {
            const noPermissionEmbed = new EmbedBuilder()
                .setTitle('Error Code 1056')
                .setDescription('- **Error**: You do not have permission to use this command!\n- **Solution**: You must have a valid ranking role to use this command!')
                .setColor('#212121')
                .setTimestamp();

            return message.reply({ embeds: [noPermissionEmbed] });
        }

        // Determine the highest rank the author can demote to based on their level
        const maxRankByLevel = {
            1: 'Corporal',
            2: 'Sergeant',
            3: 'Field-Major',
            4: 'Private'  // Level 4 can demote to any rank
        };

        const maxRank = maxRankByLevel[authorLevel];
        const maxRankIndex = rankHierarchy.indexOf(maxRank);
        const targetRankIndex = rankHierarchy.indexOf(rankArg);

        if (targetRankIndex === -1 || targetRankIndex < maxRankIndex) {
            const rankNotAllowedEmbed = new EmbedBuilder()
                .setTitle('Demote Command')
                .setDescription(`- **Error**: You can only demote down to ${maxRank}!`)
                .setColor('#212121')
                .setTimestamp();

            return message.reply({ embeds: [rankNotAllowedEmbed] });
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
                const currentRoleID = Object.values(rankRoles).find(role => member.roles.cache.has(role));

                // Ensure we only demote, not promote
                const currentRankIndex = currentRoleID ? rankHierarchy.findIndex(rank => rankRoles[rank] === currentRoleID) : -1;

                if (currentRankIndex <= targetRankIndex) {
                    failedUsers.push(user.tag);
                    return resolve();
                }

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
            const successMessage = successUsers.length > 0 ? `- **Success**: Successfully demoted to ${rankArg} role for ${successUsers.join(', ')}.\n` : '';
            const failureMessage = failedUsers.length > 0 ? `- **Error**: Failed to demote to ${rankArg} role for ${failedUsers.join(', ')}.\n` : '';
            const combinedMessage = `${successMessage}${failureMessage}`;

            const resultEmbed = new EmbedBuilder()
                .setTitle('Rank Demotion Results')
                .setDescription(`${combinedMessage}- **Bug**: Code 1058`)
                .setColor(successUsers.length > 0 ? '#58b9ff' : '#58b9ff')
                .setTimestamp();

            message.reply({ embeds: [resultEmbed] });
        });
    },
};
