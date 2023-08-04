const {EmbedBuilder} = require('@discordjs/builders')
const {setColor} = require('../utils/utils.js');

const interactionQueue = new Map();

client.DisTube.on("playSong", (queue, song) => {
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
    queue.textChannel.send({embeds: [embed]});
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
    return interaction.reply({embeds: [embed]});
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
    return interaction.reply({embeds: [embed]});
})

/**
 * Play the music given, can be either a link or a name (Youtube only)
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function play(interaction, client) {
    const link = interaction.options.getString('link')
    interactionQueue.set(interaction.id, interaction);
    client.DisTube.play(interaction.member.voice.channel, link, {
        textChannel: interaction.channel,
        member: interaction.member,
        interaction
    })
}


/**
 *  Pause the music
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function pause(interaction, client) {
    client.DisTube.pause(interaction)
    await interaction.reply({ content: `Paused`, ephemeral: true})
}

/**
 *  Resume the music
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function resume(interaction, client) {
    client.DisTube.resume(interaction)
    await interaction.reply({ content: `Resumed`, ephemeral: true})
}

/**
 *  Stop the music
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function stop(interaction, client) {
    client.DisTube.stop(interaction)
    await interaction.reply({ content: `Stopped`, ephemeral: true})
}

/**
 *  Skip the music
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function skip(interaction, client) {
    client.DisTube.skip(interaction)
    await interaction.reply({ content: `Skipped`, ephemeral: true})
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
    await interaction.reply({ embeds: [embed], ephemeral: true});
}

/**
 *  Clear the queue
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function clear(interaction, client) {
    client.DisTube.clearQueue(interaction)
    await interaction.reply({ content: `Queue cleared`, ephemeral: true})
}

/**
 *  Loop the queue
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function loop(interaction, client) {
    client.DisTube.setRepeatMode(interaction, 1)
    await interaction.reply({ content: `Looping queue`, ephemeral: true})
}

/**
 *  Unloop the queue
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function unloop(interaction, client) {
    client.DisTube.setRepeatMode(interaction, 0)
    await interaction.reply({ content: `Unlooping queue`, ephemeral: true})
}

/**
 *  Change the volume
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function volume(interaction, client) {
    const volume = interaction.options.getInteger('volume')
    client.DisTube.setVolume(interaction, volume)
    await interaction.reply({ content: `Volume set to ${volume}`, ephemeral: true})
}

/**
 *  Remove a song from the queue
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function remove(interaction, client) {
    const index = interaction.options.getInteger('deleteindex')
    client.DisTube.removeSong(interaction, index)
    await interaction.reply({ content: `Removed song at index ${index}`, ephemeral: true})
}

/**
 * Add a random song to the queue
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
async function playrandom(interaction, client) {
    const link = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley'
    client.DisTube.play(interaction.member.voice.channel, link, {
        textChannel: interaction.channel,
        member: interaction.member,
        interaction
    })
    await interaction.reply({ content: `Added random music to queue`, ephemeral: true})
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
    queue,
    clear,
    loop,
    unloop,
    volume,
    remove,
    playrandom,
    shuffle
}