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
        .setColor('#212121')
        .setImage('https://cdn.discordapp.com/attachments/1270369986396815441/1270717176797597788/COMMANDS.png?ex=66b4b717&is=66b36597&hm=589809bcaed7a3d8a47ce94cbe950f5a742ea2bd87a784b0bca8fdf520d579bd&')
        .setTimestamp()

        message.reply({ embeds: [testEmbed] });
    },
};
