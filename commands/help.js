const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Displays help information',
    async execute(message) {
        const page1Embed = new EmbedBuilder()
            .setTitle('**⚙️ Commands**')
            .setDescription('## **Commands List:**\n\n' +
                '**🛡️ Staff Commands**\n' +
                '> - 📌 **`addrank`** : __Adds a rank to a user.__\n' +
                '> - 🗑️ **`removerank`** : __Removes a rank from a user.__\n' +
                '\n'+
                '**⭐ Level 4,3,2,1 Commands**\n' +
                '> - 🔰 **`demote`** : __Demotes a user to a lower rank.__\n' +
                '> - 🎖️ **`promote`** : __Promotes a user to a higher rank.__\n' +
                '\n'+
                '**🛠️ Developer Commands**\n' +
                '> - 🧪 **`test`** : __Tests the bot functionality.__')
            .setColor('#58b9ff')
            .setImage('https://media.discordapp.net/attachments/1258742384842510406/1259077355356557392/Commands_1.png?ex=668a5eaa&is=66890d2a&hm=e20294158c0fb05e04cec357c15d1d68182dfb56b453b2adc49d1e6b760eae01&=&format=webp&quality=lossless&width=375&height=75')
            .setTimestamp();

        const page2Embed = new EmbedBuilder()
            .setTitle('**🌐 Official Parason List**')
            .setDescription('**Official Links and Resources:**\n\n' +
                '💬 **Discord Servers:**\n' +
                '> - **[Northern Frontier](https://discord.gg/northernfrontier)**\n' +
                '> - **[Parason United Discord](https://discord.gg/rK94YZqwk5)** | **[Parason United Group](https://www.roblox.com/groups/12608478/Parason-United#!/about)**\n\n' +
                '🔲 **Roblox Groups:**\n' +
                '> - **[Parason United Group](https://www.roblox.com/groups/12608478/Parason-United#!/about)**\n' +
                '> - **[Lion Committee Group](https://www.roblox.com/groups/33877731/Lion-Committee#!/about)**\n' +
                '> - **[Northern Frontier Group](https://www.roblox.com/groups/34464523/NORTHERN-FRONTIER-HUB#!/about)**\n\n' +
                '📚 **Documents and Guides:**\n' +
                '> - **[Recruitment Document](https://docs.google.com/document/d/1a85ZQ9lD1OF8k824dj9EJAxdbDSkUOiSPGjSa6U42pg/edit?usp=sharing)**\n' +
                '> - **[Chain of Command Document](https://docs.google.com/document/d/1SyTR74HWV7-3L_R_bwGy_tioeUKAmqukrbYGGHXd4QI/edit)**\n' +
                '> - **[Parason Officer Corps Guide](https://docs.google.com/document/d/1nnvaZBnDsd3pvwfCKgPU8UqzRinjMcc5VsJ7qAYebOk/edit)**\n' +
                '> - **[Parason Event Posting Guide](https://docs.google.com/document/d/1e5ac3ZZgKI8f7XibTu3vo4doc8TNnCIpgHs-_bHeHe8/edit)**\n\n' +
                '**🎮 Games:**\n' +
                '> - **[Northern Frontier](https://www.roblox.com/games/17886218648/Northern-Frontier)**\n\n' +
                '💾 **Databases:**\n' +
                '> - **[Parason United Database](https://docs.google.com/spreadsheets/d/1dz1SgbsIL6qoEIH5FAfa0LEd3C6DzK9yRSt9PXS-oQg/edit?usp=sharing)**')
            .setColor('#58b9ff')
            .setImage('https://media.discordapp.net/attachments/1258742384842510406/1259077862657622087/Commands_2.png?ex=668a5f22&is=66890da2&hm=0702072be6e972ffb8d59ee9b90c05921d06224672ad5ad1f6394cec648c8583&=&format=webp&quality=lossless&width=375&height=75')
            .setTimestamp();

        const page3Embed = new EmbedBuilder()
            .setTitle('**🖥️ #1 Programming [!notify]**')
            .setDescription('**🔔 Notify**\n'+
                '\n> `!notify <#channel>`\n> `test1`\n> `test1`\n> `test1`\n> \n> `test2`\n> `test2`\n> `test2`\n> \n> `test3`\n> `test3`\n> `test3`\n> \n> `test4`\n\n'+
                '> ***- Test 1 is normal message and test2 is Title (embed) and test3 is Description (embed) and test4 is footer (embed)***\n'+
                '> ***- Your format must have space between normal message, title, description, footer so that the bot knows where your text is belongs to.***'
            )
            .setColor('#58b9ff')
            .setTimestamp()
            .setImage('https://media.discordapp.net/attachments/1258742384842510406/1259444336513519646/Commands_3.png?ex=668bb471&is=668a62f1&hm=b572c134c12fe3642fadfbcc5db57f8d319c18aa274da8e7af11de9266667e52&=&format=webp&quality=lossless');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('◀ Previous')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next ▶')
                    .setStyle(ButtonStyle.Primary)
            );

        let currentPage = 0;
        const embeds = [page1Embed, page2Embed, page3Embed];

        const messageEmbed = await message.reply({ embeds: [embeds[currentPage]], components: [row] });

        const filter = interaction => interaction.customId === 'previous' || interaction.customId === 'next';
        const collector = messageEmbed.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async interaction => {
            if (interaction.customId === 'previous') {
                currentPage = currentPage > 0 ? --currentPage : embeds.length - 1;
            } else if (interaction.customId === 'next') {
                currentPage = currentPage + 1 < embeds.length ? ++currentPage : 0;
            }
            await interaction.update({ embeds: [embeds[currentPage]], components: [row] });
        });

        collector.on('end', collected => {
            messageEmbed.edit({ components: [] });
        });
    },
};
