const {EmbedBuilder, ButtonBuilder} = require('@discordjs/builders')
const {ActionRowBuilder, ButtonStyle} = require('discord.js')
const {setColor} = require('../utils/utils.js');
const {getLyrics} = require('genius-lyrics-api');

const interactionQueue = new Map();

client.DisTube.on("playSong", (queue, song) => {

    const skipButton = new ButtonBuilder()
        .setCustomId('skip')
        .setLabel('Skip')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji({name: '⏭️'})
    const stopButton = new ButtonBuilder()
        .setCustomId('stop')
        .setLabel('Stop')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji({name:'⛔'})
    const previousButton = new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('Previous')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji({name:'⏮'})
    const loopButton = new ButtonBuilder()
        .setCustomId('loop')
        .setLabel('Loop')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji({name:'🔁'})
    const queueButton = new ButtonBuilder()
        .setCustomId('queue')
        .setLabel('Queue')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji({name:'📜'})
    const loopQueueButton = new ButtonBuilder()
        .setCustomId('loopqueue')
        .setLabel('Loop Queue')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji({name:'🔁'})

    const buttonRow1 = new ActionRowBuilder()
        .addComponents([previousButton, stopButton, skipButton])
    
    const buttonRow2 = new ActionRowBuilder()
        .addComponents([loopButton, queueButton, loopQueueButton])

        const embed = new EmbedBuilder()
        .setTitle(`Playing ${song.name}`)
        .setURL(song.url)
        .setAuthor({name: song.user.username, iconURL:song.user.displayAvatarURL()})
        .addFields(
            {name: '**Duration**: ', value: song.formattedDuration, inline: true},
            {name: '**Requested by**: ', value: song.user.username, inline: true}
        )
        .setImage(song.thumbnail)
        .setColor(setColor())
        .setTimestamp()
    queue.textChannel.send({embeds: [embed], components: [buttonRow1, buttonRow2]});
})

client.DisTube.on("error", (channel, error) => {
	console.log(error)
})

client.DisTube.on("addList", (queue, playlist) => {
    const interaction = interactionQueue.values().next().value;
    const embed = new EmbedBuilder()
        .setTitle(`Adding ${playlist.name} to the queue`)
        .setURL(playlist.url)
        .setAuthor({name: playlist.user.username, iconURL:playlist.user.displayAvatarURL()})
        .setColor(setColor())
        .addFields(
            {name: '**Duration**: ', value: playlist.formattedDuration, inline: true},
            {name: '**Requested by**: ', value: playlist.user.username, inline: true}
        )
        .setImage(playlist.thumbnail)
        .setTimestamp()
    interactionQueue.delete(interaction.id);
    return interaction.editReply({embeds: [embed]});
})

client.DisTube.on("addSong", (queue, song) => {
    const interaction = interactionQueue.values().next().value;
    const embed = new EmbedBuilder()
        .setTitle(`Adding ${song.name} to the queue`)
        .setURL(song.url)
        .setAuthor({name: song.user.username, iconURL:song.user.displayAvatarURL()})
        .setColor(setColor())
        .addFields(
            {name: '**Author**: ', value: song.uploader.name, inline: true},
            {name: '**Duration**: ', value: song.formattedDuration, inline: true},
            {name: '**Requested by**: ', value: song.user.username, inline: false}
        )
        .setTimestamp()
    interactionQueue.delete(interaction.id);
    return interaction.editReply({embeds: [embed]});
})

async function lyrics(interaction, client) {
    const artist = interaction.options.getString('artist');
    const title = interaction.options.getString('title');
    const options = {
        apiKey: "pDplYywDwEIg1yo6PG-bS82ixm_PLGyUV2zn6aTGsuI8pZzkX6aS7IIrbKya_22F",
        artist: artist,
        title: title,
        optimizeQuery: true
    }
    console.log(options)
    return getLyrics(options).then((lyrics) => {
        // console.log(lyrics)
        if (!lyrics) return interaction.reply({content: 'No lyrics found', ephemeral: true})
        const embed = new EmbedBuilder()
            .setTitle(`Lyrics for ${title}`)
            .setAuthor({name: interaction.user.username, iconURL:interaction.user.displayAvatarURL()})
            .setColor(setColor())
            .setTimestamp()
        return interaction.reply({embeds: [embed]})
    }).catch((err) => {
        console.log(err)
        interaction.reply({content: 'No lyrics found', ephemeral: true})
    })
}

/**
 * Play the music given, can be either a link or a name (Youtube only)
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function play(interaction, client) {
    const link = interaction.options.getString('link')
    interaction.deferReply();
    interactionQueue.set(interaction.id, interaction);
    try {
        client.DisTube.play(interaction.member.voice.channel, link, {
            textChannel: interaction.channel,
            member: interaction.member,
            interaction
        })
    } catch (err) {
        console.log(err)
        interactionQueue.delete(interaction.id);
        interaction.editReply({content: 'Error playing song', ephemeral: true})
    }
}


/**
 *  Pause the music
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function pause(interaction, client) {
    try {
        client.DisTube.pause(interaction)
        await interaction.reply({ content: `Paused`, ephemeral: true})
    } catch (err) {
        await interaction.reply({ content: `No song to pause`, ephemeral: true})
    }
}

/**
 *  Resume the music
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function resume(interaction, client) {
    try {
        client.DisTube.resume(interaction)
        await interaction.reply({ content: `Resuming song`})
    } catch (err) {
        await interaction.reply({ content: `No song to resume`, ephemeral: true})
    }
}

/**
 *  Stop the music
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function stop(interaction, client) {
    try {
        client.DisTube.stop(interaction)
        await interaction.reply({ content: `Stopping song`})
    } catch (err) {
        await interaction.reply({ content: `No song to stop`, ephemeral: true})
    }
}

/**
 *  Skip the music
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function skip(interaction, client) {
    try {
        client.DisTube.skip(interaction)
        await interaction.reply({ content: `Skipping song`})
    } catch (err) {
        await interaction.reply({ content: `No song to skip`, ephemeral: true})
    }
}

/**
 *  Play previous music
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function previous(interaction, client) {
    try {
        client.DisTube.previous(interaction)
        await interaction.reply({ content: `Playing previous song`, ephemeral: true})
    } catch (err) {
        await interaction.reply({ content: `No previous song`, ephemeral: true})
    }
}

/**
 *  Show the queue
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function queue(interaction, client) {
    const queue = client.DisTube.getQueue(interaction);
    if (queue.songs.slice(1).length === 0) return await interaction.reply({ content: `No queue`, ephemeral: true});
    const embed = new EmbedBuilder()
        .setTitle('Queue')
        .setColor(setColor())
        .setTimestamp()
        .addFields({ name: 'Current song', value: queue.songs[0].name, inline: false })
        .addFields({
            name: 'Next songs',
            value: queue.songs.slice(1, 15).map((song, id) => `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``).join('\n'),
            inline: false
        });
    await interaction.reply({ embeds: [embed]});
}

/**
 *  Clear the queue
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function clear(interaction, client) {
    try {
        client.DisTube.clearQueue(interaction)
        await interaction.reply({ content: `Clearing queue`})
    } catch (err) {
        await interaction.reply({ content: `No queue`, ephemeral: true})
    }
}

/**
 *  Loop the queue
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function loop(interaction, client) {
    const queue = client.DisTube.getQueue(interaction);
    try {
        if (queue.repeatMode === 1) {
            client.DisTube.setRepeatMode(interaction, 0)
            return await interaction.reply({ content: `Unlooping Song`})
        } else {
            client.DisTube.setRepeatMode(interaction, 1)
            await interaction.reply({ content: `Looping Song`})
        }
    } catch (err) {
        await interaction.reply({ content: `No queue`, ephemeral: true})
    }
}

/**
 *  Loop the queue
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function loopqueue(interaction, client) {
    const queue = client.DisTube.getQueue(interaction);
    try {
        if (queue.repeatMode === 2) {
            client.DisTube.setRepeatMode(interaction, 0)
            return await interaction.reply({ content: `Unlooping Queue`})
        } else {
            client.DisTube.setRepeatMode(interaction, 2)
            await interaction.reply({ content: `Looping Queue`})
        }
    } catch (err) {
        await interaction.reply({ content: `No queue`, ephemeral: true})
    }
}

/**
 *  Unloop the queue
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function unloop(interaction, client) {
    client.DisTube.setRepeatMode(interaction, 0)
    await interaction.reply({ content: `Unlooping queue`})
}

/**
 *  Change the volume
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function volume(interaction, client) {
    try {
        const volume = interaction.options.getInteger('volume')
        client.DisTube.setVolume(interaction, volume)
        await interaction.reply({ content: `Volume set to ${volume}`})
    } catch (err) {
        await interaction.reply({ content: `Volume must be between 0 and 100`, ephemeral: true})
    }
}

/**
 *  Remove a song from the queue
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function remove(interaction, client) {
    const index = interaction.options.getInteger('deleteindex')
    try {
        client.DisTube.removeSong(interaction, index)
        await interaction.reply({ content: `Removed song at index ${index}`})
    } catch (err) {
        await interaction.reply({ content: `No song at index ${index}`, ephemeral: true})
    }
}

/**
 * Add a random song to the queue
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function playrandom(interaction, client) {
    const link = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley'
    interaction.deferReply();
    interactionQueue.set(interaction.id, interaction);
    client.DisTube.play(interaction.member.voice.channel, link, {
        textChannel: interaction.channel,
        member: interaction.member,
        interaction
    })
    await interaction.editReply({ content: `Added random music to queue`})
}

/**
 * Shuffle the queue
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function shuffle(interaction, client) {
    client.DisTube.shuffle(interaction)
    await interaction.reply({ content: `Shuffled queue`, ephemeral: true})
}

module.exports = {
    play,
    pause,
    resume,
    stop,
    skip,
    previous,
    queue,
    loopqueue,
    clear,
    loop,
    unloop,
    volume,
    remove,
    playrandom,
    shuffle,
    lyrics
}