const { Configuration, OpenAIApi } = require("openai");
const env = require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require("discord.js");
const {setColor} = require('../utils/utils.js')

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION_ID,
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);

async function makeGPTRequest(prompt) {
    try {
        const response = await openai.createImage({
            prompt: prompt,
            size: "256x256",
          });
        return response.data.data[0].url
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = {
    data: new SlashCommandBuilder()
            .setName('image')
            .setDescription('Interact with an AI')
            .addStringOption(option => option.setName('image').setDescription('L\'image que tu veux').setRequired(true)),
        execute: async (interaction) => {
            await interaction.deferReply()
            const question = interaction.options.getString('image')
            const res = await makeGPTRequest(question)
            if (res === null) return interaction.editReply({ content: 'Error', ephemeral: true })
            const embed = new EmbedBuilder()
                .setTitle('Generated Image')
                .setDescription(`Prompt: ${question}`)
                .setColor(setColor())
                .setImage(res);

            // Send the embed with the image
            interaction.editReply({ embeds: [embed] });
          }
}
