const { GatewayIntentBits, Partials } = require('discord.js');
const presenceData = require('../JSON/presence.json');

module.exports = {
    // Client configuration:
    client: {
        // Constructor:
        constructor: {
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
                GatewayIntentBits.MessageContent
            ],
            partials: [
                Partials.Channel,
                Partials.Message,
                Partials.User,
                Partials.GuildMember,
                Partials.Reaction
            ],
            presence: {
                activities: [
                    {
                        name: presenceData.activity,
                        type: presenceData.activity_type
                    }
                ],
                status: presenceData.status
            }
        },
        // Identification:
        token: "MTI1NDQwOTk2MzkwMDc2ODI2Ng.GGjbAV.xQU8avG-j2xi-KWmdWlQPQZKCOwjQKwhA1OyvQ",
        id: "1223243071286677534"
    },

    // Database:
    database: {
        mongodb_uri: 'mongodb+srv://AmokerAdministrative:Reld70dJdhEPhWIa@amokerdatabase.rdp4my4.mongodb.net/?retryWrites=true&w=majority&appName=AmokerDatabase'
    },

    // APIs:
    apis: {
        
    },

    // Users:
    users: {
        developers: ["1119592830327861358"],
        owner: "985655980668903454"
    }
};
