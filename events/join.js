const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
        // Send welcome message in the server
        const channelId = '1252263349065089034'; // Replace with your actual channel ID
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

        // Assign a role to the new member
        const roleId = '1251367866738151505'; // Replace with your actual role ID
        const role = member.guild.roles.cache.get(roleId);

        if (role && !member.roles.cache.has(roleId)) {
            try {
                await member.roles.add(role);
                console.log(`Assigned role ${role.name} to ${member.user.tag}`);
            } catch (error) {
                console.error(`Failed to assign role to ${member.user.tag}:`, error);
            }
        }

        // Send DM to the new member
        try {
            const dmMessage = `
**Thank you for joining Parason! If you're interested in joining, message a Warrant Officer+. You'll be ranked shortly. Before diving right in, there are a few important things to note:**

**📌 Look at 'How to Join' if you're not sure how to join!**
**🙋‍♂️ Recruit Others**
Encourage others to join! Recruiting new members not only helps us grow but also earns you points to climb the ranks.

**⚡ Stay Active**
While activity isn't always mandatory, going inactive may result in fire warnings. You have a quota of two events a week, if you can’t keep up the activity for a while make an inactivity log!

**🎉 Fun Events**
We host exciting events and games on Roblox and others, and many other entertainments for everyone to enjoy. Keep an eye out for them!

**🎖️ Rank up**
Earn points to advance through the ranks and unlock new opportunities within the group.

**📊 Elections**
Democracy is important in Parason. You can change the tide of an election with your vote. To create a party, offer some paperwork and a logo with a band of members and your party may get considered if it has enough support!

**📜 Check the rules of The Frontier and Parason**
Familiarize yourself with our rules to ensure a smooth experience for everyone.

**💼 Interested in a Staff/HR position?**
If you're interested in becoming staff, let your recruiting officer know. We're always looking for the best of the best!

**⭐ You will start off with a quota of two events a week. Prove your worth as an armed citizenry to earn Private and higher ranks. I wish you the best of luck.**

**🙌 Thanks for taking the time to read this. Enjoy your time here!**

- [Roblox Group](https://www.roblox.com/groups/12608478/Parason-United#!/about)
- [Discord Invite](https://discord.gg/HuHJtzq8)

**⏳ If you do not get ranked in 12 hours DM the recruiter or a higher rank**

**God Bless,**
Helm`;

            await member.send(dmMessage);
        } catch (error) {
            console.error(`Failed to send DM to ${member.user.tag}:`, error);
        }
    });
};
