import { SlashCommandBuilder, Attachment, PermissionFlagsBits } from "discord.js";
import { Command } from "../classes/command";

export default new Command({
    builder: new SlashCommandBuilder()
        .setName("delreaction")
        .setDescription("Retire une reaction à partir du keyword")
        .addStringOption(option =>
            option.setName("keyword").setDescription("keyword a chercher").setAutocomplete(true).setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) as SlashCommandBuilder,
    run: async ({ client, interaction }) => {
        const name = interaction.options.get("keyword")?.value as string;

        client.reactions.delete(name);

        interaction.editReply({ content: `Reaction supprimée: ${name}` });
    },
    autocomplete: (client, interaction) => {
        const name = interaction.options.get("keyword")?.value as string;
        const reactions = Array.from(client.reactions.keys());
        const choices = reactions
            .filter(reaction => reaction.includes(name))
            .map(reaction => ({ name: reaction, value: reaction }))
            .slice(0, 25);
        interaction.respond(choices);
    },
});
