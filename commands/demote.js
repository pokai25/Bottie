const { error } = require('console');
const { Permissions, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'demote',
    description: 'Demotes a user by removing their rank',
    execute(message, args) {

        const allowedRoleID = '1258770336862830716';

     
        const demotableRoles = {
            private: '1248818417499373638',
            'lance corporal': '1248818393146986497',
            corporal: '1248818392681680908',
            sergeant: '1248818391805067264',
            major: '1248815965924491294',
        };

   
        if (!message.member.roles.cache.has(allowedRoleID)) {
            const noPermissionEmbed = new EmbedBuilder()
                .setTitle('Error Code 1056')
                .setDescription('- **Error** : You do not have permission to use this command!\n- **Solution** : You must have the demoting role to use this command!')
                .setColor('#58b9ff')
                .setTimestamp();

            return message.reply({ embeds: [noPermissionEmbed] });
        }

        // Check if the command was used correctly
        if (args.length < 2) {
            const usageEmbed = new EmbedBuilder()
                .setTitle('Error Code 1059')
                .setColor('#58b9ff')
                .setDescription('- **Error** : Command input is invalid!\n- **Solution** : Please use the command in the following format : !demote <@user> <rank>')
                .setTimestamp();

            return message.reply({ embeds: [usageEmbed] });
        }

        // Get the mentioned user
        const user = message.mentions.users.first();
        if (!user) {
            const noUserMentionEmbed = new EmbedBuilder()
                .setTitle('Error Code 1062')
                .setDescription('- **Error** : No valid user mentioned!\n- **Solution** : Please mention a valid user to demote.')
                .setColor('#58b9ff')
                .setTimestamp();

            return message.reply({ embeds: [noUserMentionEmbed] });
        }

        const rankArg = args[1].toLowerCase();
        const rankID = demotableRoles[rankArg];
        if (!rankID) {
            const invalidRankEmbed = new EmbedBuilder()
                .setTitle('Error Code 1060')
                .setDescription('- **Error** : Invalid Rank executed!\n- **Solution** : Please execute the correct rank to demote!')
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

        // Check if the member has the rank role
        if (!member.roles.cache.has(rankID)) {
            const noRoleEmbed = new EmbedBuilder()
                .setTitle('Error Code 1064')
                .setDescription(`- **Error** : User does not have the ${rankArg} rank to be demoted!\n- **Solution** : Assign the correct rank to the user.`)
                .setColor('#58b9ff')
                .setTimestamp();

            return message.reply({ embeds: [noRoleEmbed] });
        }

        // Remove the rank role from the member
        member.roles.remove(rankID)
            .then(() => {
                const successEmbed = new EmbedBuilder()
                    .setTitle('Rank Demoted')
                    .setDescription(`- **Success** : Successfully demoted ${user.tag} from the rank of ${rankArg}!\n- **Bug** : Code 1058`)
                    .setColor('#58b9ff')
                    .setTimestamp();

                message.reply({ embeds: [successEmbed] });
            })
            .catch(error => {
                console.error('Failed to demote rank:');
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error Code 1063')
                    .setDescription('- **Error** : The bot encountered an error while attempting the user!\n- **Solution** : Please contact the staff members as well as the developers.')
                    .setColor('#58b9ff')
                    .setTimestamp();

                message.reply({ embeds: [errorEmbed] });
            });
    },
};
