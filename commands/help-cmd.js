const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help-cmd',
    description: 'Sends a test embed',
    execute(message, args) {
        const testEmbed = new EmbedBuilder()
        .setTitle('**🔧 Commands Lists**')
        .setDescription('## **Ranking Commands:**\n\n' +
            '> - 📈  **`promote`** : __Promote the user(s).__\n' +
            '> - 📉  **`demote`** : __Demote the user(s).__\n' +
            '\n'+
            '## **Staff Commands: **\n'+
            '> - 🏆  **`addrank`** : __Add(s) level(s) to the person.__\n'+
            '> - 🗑️  **`removerank`** : __Remove(s) level(s) to the person.__\n'+
            '> - ⛔  **`permblacklist`** : __Permanently blacklist the user(s).__\n'+
            '> - 📛  **`tempblacklist`** : __Temporary blacklist the user(s).__\n'+
            '\n'+
            '## **Public Commands: **\n'+
            '> - 👥  **`recruit`** : __Recruit the user(s).__\n'+
            '> - ❓  **`help`** : __Lists of information.__\n'+
            '> - 🧪  **`test`** : __Mainly for developers to test but anyone can use it.__\n'+
            '\nPlease use the command __***!help-format***___ if you are unsure how to use the format commands\n'
        )
        .setColor('#58b9ff')
        .setImage('https://cdn.discordapp.com/attachments/1258742384842510406/1259077355356557392/Commands_1.png?ex=669441ea&is=6692f06a&hm=86884827b60f01f2a3d34023296c71000d73134d974ccca9c1eaff9bd9308b88&')
        .setTimestamp()

        message.reply({ embeds: [testEmbed] });
    },
};
