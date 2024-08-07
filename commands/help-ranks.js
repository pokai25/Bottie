const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'help-ranks',
    description: 'Displays help information',
    async execute(message) {
        const page1Embed = new EmbedBuilder()
            .setTitle('**🎖️ Rank List**')
            .setDescription('## **Ranks :**\n\n' +
            '> - Field-Marshal ・ `1248815960966823978`\n'+
            '> - Brigadier-Sovereign ・ `1248815964620066856`\n'+
            '> - Colonel ・ `1248815965580558418`\n'+
            '> - Field-Major ・ `1248815965924491294`\n'+
            '> - Captain ・ `1248815966263967787`\n'+
            '> - Pathfinder ・ `1248815967262212176`\n'+
            '> - Lieutenant ・ `1248819920595189862`\n'+
            '> - Warrant-Officer ・ `1248815968885538816`\n'+
            '> - Chef-Sergeant ・ `1248818391024799804`\n'+
            '> - Sergeant ・ `1248818391805067264`\n'+
            '> - Corporal ・ `1248818392681680908`\n'+
            '> - Lance-Corporal ・ `1248818393146986497`\n'+
            '> - Private ・ `1248818417499373638`\n'+
            '\n'+
            '**💡 For example** : ***__!promote @user1 Lance-Corporal__***\n'+
            '**📌 Note** : The numbers is for ***DEVELOPERS***. Nothing to do with the command.\n'
            )
            .setColor('#212121')
            .setImage('https://media.discordapp.net/attachments/1270369986396815441/1270722332540932136/COMMANDS_2.png?ex=66b4bbe4&is=66b36a64&hm=57ffb0411ee85256de5f866d6da8bf2106a0646a84089e990b2f22330febc2f6&=&format=webp&quality=lossless&width=400&height=80')
            .setTimestamp()
            .setFooter({ text: 'Page・1' });

        const page2Embed = new EmbedBuilder()
            .setTitle('⚡ **Levels List**')
            .setDescription('## **Levels : **\n\n' +
                '\n> - level1 ・ `1258770431331012659`' +
                '\n> - level2 ・ `1258770333486288979`' +
                '\n> - level3 ・ `1258770232835833856`' +
                '\n> - level3 ・ `1258770336862830716`\n' +
                '\n'+
                '**💡 For example** : ***__!addrank @user1 level1__***\n'+
                '**📌 Note** : The numbers is for ***DEVELOPERS***. Nothing to do with the command.\n'

            )
            .setColor('#212121')
            .setImage('https://media.discordapp.net/attachments/1270369986396815441/1270722332540932136/COMMANDS_2.png?ex=66b4bbe4&is=66b36a64&hm=57ffb0411ee85256de5f866d6da8bf2106a0646a84089e990b2f22330febc2f6&=&format=webp&quality=lossless&width=400&height=80')
            .setTimestamp()
            .setFooter({ text: 'Page・2' });



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
        const embeds = [page1Embed, page2Embed];

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
