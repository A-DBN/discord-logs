import { SlashCommandBuilder, Attachment, PermissionFlagsBits } from "discord.js";
import { Command } from "../classes/command";

export default new Command({
    builder: new SlashCommandBuilder()
    .setName("reaction")
    .setDescription("Joue au pile ou face")
    .addStringOption(option =>
        option
            .setName("keyword")
            .setDescription("keyword a chercher")
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName("message")
            .setDescription("le message a envoyer")
            .setRequired(false)
    )
    .addAttachmentOption(
        option => option
            .setName("attachment")
            .setDescription("Image/gif/video")
            .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) as SlashCommandBuilder,
    run: async ({ client, interaction }) => {
        const attachment = interaction.options.get("attachment")?.attachment as Attachment;
        const message = interaction.options.get("message")?.value as string;
        const name = interaction.options.get("keyword")?.value as string;
        
        if (!attachment && !message) interaction.editReply({ content: "Il faut au minimum un message ou/et un attachment" });

        client.reactions.set(name, {name, message, attachment });
        interaction.editReply({ content: `Reaction sauvegardée: ${name}` });
    }
});