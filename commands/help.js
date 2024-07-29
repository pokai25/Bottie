const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Displays help information',
    async execute(message) {
        const page1Embed = new EmbedBuilder()
            .setTitle('**❓ Lists**')
            .setDescription('## **Help Commands:**\n\n' +
                '> - ✏️  **`help-format`** : __The command format to use the command.__\n' +
                '> - 🤖  **`help-cmds`** : __List of commands.__\n' +
                '> - 🎖️  **`help-ranks`** : __List of ranks for commands.__\n' +
                '\n'
            )
            .setColor('#58b9ff')
            .setImage('https://cdn.discordapp.com/attachments/1258742384842510406/1261881506629160980/Commands_10.png?ex=6694923b&is=669340bb&hm=a9e60689f69554dcff83ab331a081ba3b66b12a67636c004f1193e7371970dde&')
            .setTimestamp()
            .setFooter({ text: 'Page・1' });

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
            .setTimestamp()
            .setFooter({ text: 'Page・2' });

        const page3Embed = new EmbedBuilder()
            .setTitle('**🤖 Bot Information**')
            .setDescription('****\n'+
                '\n'+
                '##  👑  **Owner**\n'+
                '> - <@677732203861377055> - Bot Owner / Server Owner\n'+
                '\n'+
                '##  🛠️  **Developers**\n'+
                '> - <@1119592830327861358> - Lead Developer / Main developer\n'+
                '\n'+
                '##  🎨  **Designers**\n'+
                '> - <@671700006402654218> - Designer\n'+
                '\n'+
                '##  👾  **Bot information**\n'+
                '> - `Date created` : 5 July 2024\n'+
                '> - `Bot ID` : 1254409963900768266\n'+
                '> - `Vulnerability` : 4 (Low)'
            )
            .setColor('#58b9ff')
            .setTimestamp()
            .setImage('https://cdn.discordapp.com/attachments/1258742384842510406/1261911225361764402/Commands_11.png?ex=6694ade9&is=66935c69&hm=d3c054e2ac0c711b63a7b84695b48c2025a07c34b6dcb3f325c36d9a710ed23b&')
            .setFooter({ text: 'Page・3' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('◀・Previous')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next・▶')
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
