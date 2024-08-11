const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const music = require("./commands");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Music commands")
        .addSubcommand(subcommand =>
            subcommand
                .setName("play")
                .setDescription("Play music")
                .addStringOption(option =>
                    option.setName("link").setDescription("Link or name of the music/playlist").setRequired(true)
                )
        )
        .addSubcommand(subcommand => subcommand.setName("stop").setDescription("Stop music"))
        .addSubcommand(subcommand => subcommand.setName("pause").setDescription("Pause music"))
        .addSubcommand(subcommand => subcommand.setName("resume").setDescription("Resume music"))
        .addSubcommand(subcommand => subcommand.setName("skip").setDescription("Skip music"))
        .addSubcommand(subcommand => subcommand.setName("previous").setDescription("Play previous music"))
        .addSubcommand(subcommand => subcommand.setName("queue").setDescription("Show queue"))
        .addSubcommand(subcommand => subcommand.setName("clear").setDescription("Clear queue"))
        .addSubcommand(subcommand => subcommand.setName("loop").setDescription("Loop music"))
        .addSubcommand(subcommand => subcommand.setName("loopqueue").setDescription("Loop queue"))
        .addSubcommand(subcommand => subcommand.setName("unloop").setDescription("Unloop"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("volume")
                .setDescription("Change volume")
                .addIntegerOption(option => option.setName("volume").setDescription("Change volume").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove music")
                .addIntegerOption(option =>
                    option.setName("deleteindex").setDescription("Remove a music from the queue").setRequired(true)
                )
        )
        .addSubcommand(subcommand => subcommand.setName("playrandom").setDescription("Play random music"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("lyrics")
                .setDescription("Get current lyrics")
                .addStringOption(option =>
                    option.setName("title").setDescription("Title of the music").setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("artist").setDescription("Artist of the music").setRequired(true)
                )
        )
        .addSubcommand(subcommand => subcommand.setName("shuffle").setDescription("Shuffle queue")),
    execute: async interaction => {
        if (!interaction.member.voice.channel)
            return interaction.reply({
                content: "Tu dois être présent dans un vocal pour utiliser cette commande",
                ephemeral: true,
            });
        const subcommand = interaction.options.getSubcommand();
        try {
            // Call the function from the music folder with the same name as the subcommand
            music[subcommand](interaction, client);
        } catch (error) {
            console.log(error);
        }
    },
};
