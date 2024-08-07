const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'help-formats',
    description: 'Displays help information',
    async execute(message) {
        const page1Embed = new EmbedBuilder()
            .setTitle('**✏️ Formats List**')
            .setDescription('## **Formats:**\n\n' +
                '> - 📈  **`promote`** : __!promote <@user1 <rank>__\n' +
                '> - 📉  **`demote`** : __!demote <@user1> <rank>__\n' +
                '\n'+
                '## **Staff Commands: **\n'+
                '> - 🏆  **`addrank`** : __!addrank <@user1> <level>__\n'+
                '> - 🗑️  **`removerank`** : __!remmoverank <@user1> <level>__\n'+
                '> - ⛔  **`permblacklist`** : __[ NOT-RELEASED ]__\n'+
                '> - 📛  **`tempblacklist`** : __[ NOT-RELEASED ]__\n'+
                '\n'+
                '## **Public Commands: **\n'+
                '> - 👥  **`recruit`** : __!recruit <@user>__\n'+
                '> - ❓  **`help`** : __!help__\n'+
                '> - 🧪  **`test`** : __!test__\n'
            )
            .setColor('#212121')
            .setImage('https://cdn.discordapp.com/attachments/1270369986396815441/1270717503353389058/COMMANDS_1.png?ex=66b4b765&is=66b365e5&hm=380eccd8cc9a642c17a8d038ca8c99e7ba13125a8ae7892fe2a0746ce9e80cc0&')
            .setTimestamp()
            .setFooter({ text: 'Page・1' });

        const page2Embed = new EmbedBuilder()
            .setTitle('📝 **Addtional Format Info **')
            .setDescription('## **Promote / Demote**\n\n' +
                '\n> - ⭐ **`promote / demote`** : You can also promote or demote multiple users at once. For example, use the command __***!promote <@user1><@user2><@user3> <rank>***__. Make sure to add a space between each command, user, and rank.\n> ' +
                '\n> - Level 1 : Private-corporal \n> - Level 2 : Private to Sergeant \n> - Level 3 : Private-Major \n> - Level 4 : Able to all rank to any users' +
                '\n'+
                '## **Addrank / Removerank**\n'+
                '> - 🏆  **`addrank / removerank`** : This is also similar to promote / demote command. For example, use the command __***!addrank <@user1><@user2><@user3> <level>***__. Make sure to add a space between each command, user, and level.\n'+
                '\n'
            )
            .setColor('#212121')
            .setImage('https://cdn.discordapp.com/attachments/1270369986396815441/1270717503353389058/COMMANDS_1.png?ex=66b4b765&is=66b365e5&hm=380eccd8cc9a642c17a8d038ca8c99e7ba13125a8ae7892fe2a0746ce9e80cc0&')
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
