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
            UIFI: '1248819697265152041',
            Colonel: '1248815965580558418',
            'Brigadier-Sovereign': '1248815964620066856',
            'Democracy-Officer': '1248819527299633202',
            'Field-Marshal': '1248815960966823978'
        };

        // Rank hierarchy
        const rankHierarchy = [
            'Field-Marshal',
            'Democracy-Officer',
            'Brigadier-Sovereign',
            'Colonel',
            'UIFI',
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

        // Check if the command was used correctly
        if (args.length < 2) {
            const usageEmbed = new EmbedBuilder()
                .setTitle('Error Code 1059')
                .setColor('#58b9ff')
                .setDescription('- **Error**: Command input is invalid!\n- **Solution**: Please use the command in the following format: !promote <@user1> <@user2> ... <rank>')
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
        let authorRankIndex = -1;
        for (const [index, rank] of rankHierarchy.entries()) {
            if (message.member.roles.cache.has(rankRoles[rank])) {
                authorRankIndex = index;
                break;
            }
        }

        if (authorRankIndex === -1) {
            const noPermissionEmbed = new EmbedBuilder()
                .setTitle('Error Code 1056')
                .setDescription('- **Error**: You do not have permission to use this command!\n- **Solution**: You must have a valid ranking role to use this command!')
                .setColor('#58b9ff')
                .setTimestamp();

            return message.reply({ embeds: [noPermissionEmbed] });
        }

        const targetRankIndex = rankHierarchy.indexOf(rankArg);
        if (targetRankIndex === -1 || targetRankIndex <= authorRankIndex) {
            const rankNotAllowedEmbed = new EmbedBuilder()
                .setTitle('Promote Command')
                .setDescription('- **Error**: You can only promote to ranks lower than your own!')
                .setColor('#58b9ff')
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

                // Ensure we only promote, not demote
                const currentRankIndex = currentRoleID ? rankHierarchy.findIndex(rank => rankRoles[rank] === currentRoleID) : -1;

                if (currentRankIndex >= targetRankIndex) {
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
