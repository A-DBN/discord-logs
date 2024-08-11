import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Command } from "../classes/command";
import { createCanvas } from "canvas";

export default new Command({
    builder: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Joue au pile ou face")
    .addStringOption(option =>
        option
            .setName("side")
            .setDescription("Pile ou Face")
            .setRequired(true)
            .addChoices({ name: "Pile", value: "Pile" }, { name: "Face", value: "Face" })
    ) as SlashCommandBuilder,
    run: async ({ client, interaction }) => {
        const sides = ["Pile", "Face"];
        const randomSide = sides[Math.floor(Math.random() * sides.length)];
        const userSide = interaction.options.get("side")?.value as string;
        const canvas = createCanvas(200, 200);
        const ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.arc(100, 100, 80, 0, 2 * Math.PI);
        ctx.fillStyle = "#cfae5f";
        ctx.fill();

        ctx.font = "bold 40px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(randomSide, 100, 100);

        const attachment = canvas.toBuffer();
        return randomSide !== userSide
            ? interaction.editReply({ content: "Côté séléctionné: " + userSide + `\nRésultat: Perdu`, files: [attachment] })
            : interaction.editReply({
                content: "Côté séléctionné: " + userSide + `\nRésultat: Gagné`,
                files: [attachment],
            });
    }
});