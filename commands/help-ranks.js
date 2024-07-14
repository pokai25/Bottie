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
            .setColor('#58b9ff')
            .setImage('https://cdn.discordapp.com/attachments/1258742384842510406/1261927224295166063/Commands_13.png?ex=6694bccf&is=66936b4f&hm=d984f0f48b6ccaaf5f6b927959236c032a0333b5d5272a387daef608f3c9fd11&')
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
            .setColor('#58b9ff')
            .setImage('https://cdn.discordapp.com/attachments/1258742384842510406/1261927224295166063/Commands_13.png?ex=6694bccf&is=66936b4f&hm=d984f0f48b6ccaaf5f6b927959236c032a0333b5d5272a387daef608f3c9fd11&')
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
