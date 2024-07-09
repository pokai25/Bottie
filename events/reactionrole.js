module.exports = async (client) => {
    const reactionRoleMap = {
        '⬛': '1252263841564459068',
        '👩‍🍳': '1252266221781385286',
        '👨‍🦽': '1252266898494853121',
    };

    const secondReactionRoleMap = {
        '🟥': '1252816335168344094',
        '🟦': '1252816216188260382',
        '🟩': '1252817158837239828',
        '🟫': '1252815951280341054',
        '🟧': '1252264221375205497',
        '🟪': '1252815890530041919',
    };

    const targetMessageId1 = '1259829570694021143';
    const targetChannelId1 = '1252124871912067186';

    const targetMessageId2 = '1259831117112938527';
    const targetChannelId2 = '1252124871912067186';

    client.once('ready', async () => {
        const channel1 = await client.channels.fetch(targetChannelId1);
        const message1 = await channel1.messages.fetch(targetMessageId1);

        const emojis1 = ['⬛', '👩‍🍳', '👨‍🦽'];
        for (const emoji of emojis1) {
            await message1.react(emoji);
        }

        const channel2 = await client.channels.fetch(targetChannelId2);
        const message2 = await channel2.messages.fetch(targetMessageId2);

        const emojis2 = ['🟥', '🟦', '🟩', '🟫', '🟧', '🟪'];
        for (const emoji of emojis2) {
            await message2.react(emoji);
        }
    });

    client.on('messageReactionAdd', async (reaction, user) => {
        if (user.bot) return;

        const guild = reaction.message.guild;
        const member = await guild.members.fetch(user.id);

        if (reaction.message.id === targetMessageId1) {
            const roleId = reactionRoleMap[reaction.emoji.name];
            if (!roleId) return;

            if (member) {
                await member.roles.add(roleId).catch(console.error);
            }
        } else if (reaction.message.id === targetMessageId2) {
            const roleId = secondReactionRoleMap[reaction.emoji.name];
            if (!roleId) return;

            const userReactions = reaction.message.reactions.cache.filter(r => r.users.cache.has(user.id));

            if (userReactions.size > 1) {
                userReactions.forEach(async r => {
                    await r.users.remove(user.id).catch(console.error);
                });
            } else {
                if (member) {
                    await member.roles.add(roleId).catch(console.error);
                }
            }
        }
    });

    client.on('messageReactionRemove', async (reaction, user) => {
        if (user.bot) return;

        const guild = reaction.message.guild;
        const member = await guild.members.fetch(user.id);

        if (reaction.message.id === targetMessageId1) {
            const roleId = reactionRoleMap[reaction.emoji.name];
            if (!roleId) return;

            if (member) {
                await member.roles.remove(roleId).catch(console.error);
            }
        } else if (reaction.message.id === targetMessageId2) {
            const roleId = secondReactionRoleMap[reaction.emoji.name];
            if (!roleId) return;

            if (member) {
                await member.roles.remove(roleId).catch(console.error);
            }
        }
    });
};
