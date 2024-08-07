const { Client, GatewayIntentBits, Collection, ActivityType, MessageEmbed, PresenceUpdateStatus } = require('discord.js');
const fs = require('fs');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

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

// Require the join.js and reactionrole.js scripts
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


client.on('ready', () => {
    client.user.setActivity({
        name: "Preaching Faith!",
        type: ActivityType.Playing,
    });
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
