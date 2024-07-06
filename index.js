const { Client, GatewayIntentBits, Collection, MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
const express = require('express');

// Discord bot setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution
    ]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.name, command);
}

// Require the join.js script
require('./events/join')(client);

// Express web server setup
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Bot is running!');
});

app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});

// Discord bot event handlers
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        // Check if the command can be executed in the current channel
        const allowedChannels = ['1258743001723699200', '1258805018518356098', '1251368394163359786'];
        if (!allowedChannels.includes(message.channel.id)) {
            return message.reply('**This command can only be used in bot cmds channel!**');
        }

        // Check if the user has the required role to execute commands
        // Include your role permission check logic here

        command.execute(message, args);
    } catch (error) {
        console.error(error);

        const errorEmbed = new MessageEmbed()
            .setTitle('🔵 Error')
            .setDescription(`\`${error.message}\``)
            .setColor(statusColor)
            .setTimestamp();

        message.reply({
            content: '**Sorry, I ran into an error while executing that command.**\n\n',
            embeds: [errorEmbed]
        });
    }
});

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
client.login(process.env.TOKEN);
