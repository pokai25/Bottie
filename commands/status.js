const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'status',
    description: 'Displays the server and bot status',
    async execute(message) {
        const guild = message.guild;

        if (!guild) {
            const noServerEmbed = new EmbedBuilder()
                .setColor('#212121')
                .setDescription('This command must be used in a server!');

            return message.reply({ embeds: [noServerEmbed] });
        }

        const members = guild.members.cache;
        const totalMembers = members.filter(member => !member.user.bot).size;
        const totalBots = members.filter(member => member.user.bot).size;
        const onlineMembers = members.filter(member => member.presence && member.presence.status === 'online').size;
        const totalUsers = totalMembers + totalBots;
        const botPing = Math.round(message.client.ws.ping);
        const botVersion = '1.2.0';

        const statusEmbed = new EmbedBuilder()
            .setTitle('📊 Status')
            .setColor('#212121')
            .setImage('https://media.discordapp.net/attachments/1258742384842510406/1260911144042889298/Commands_8.png?ex=66910a83&is=668fb903&hm=50973ecf719134a2a2f8c0a53f1741d1db41f9ab6a1dff598df3524c9b8fd95c&=&format=webp&quality=lossless')
            .setDescription(`
## **🌐 Server Status**

- Members: ${totalMembers}
- Bots: ${totalBots}
- Online: ${onlineMembers}

### **Total**: ${totalUsers}

## **🤖 Bot Status**

- Ping: ${botPing} ms
- Version: ${botVersion}
            `)
            .setTimestamp();

        message.reply({ embeds: [statusEmbed] });
    },
};
