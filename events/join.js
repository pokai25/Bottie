const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
        const channelId = '1268505710149505064'; 
        const channel = member.guild.channels.cache.get(channelId);

        if (!channel) {
            console.error('Could not find channel');
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`**Welcome to Parason United**`)
            .setDescription(`:wave: Welcome to our server <@${member.user.id}>! To join Parason United, please refer to the 'How to Join' channel for detailed instructions. We hope you enjoy your stay here. If you have any questions, feel free to ask.`)
            .setColor(0x58b9ff)
            .setTimestamp(new Date())
            .setFooter({ text: 'Enjoy your stay!' })
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }));

        channel.send({ embeds: [embed] });

        const roleId = '1251367866738151505'; // Role ID to assign
        const role = member.guild.roles.cache.get(roleId);

        if (!role) {
            console.error('Role not found');
            return;
        }

        // Check if the member already has the role
        if (!member.roles.cache.has(roleId)) {
            try {
                await member.roles.add(role);
                console.log(`Assigned role ${role.name} to ${member.user.tag}`);
            } catch (error) {
                console.error(`Failed to assign role to ${member.user.tag}:`, error);
            }
        }
    });
};
