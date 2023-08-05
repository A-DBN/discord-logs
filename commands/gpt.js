const { Configuration, OpenAIApi } = require("openai");
const env = require('dotenv').config()
const { SlashCommandBuilder } = require('@discordjs/builders')

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION_ID,
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);

async function makeGPTRequest(prompt) {
    try {
        const res = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: prompt,
            temperature: 0.7,
            max_tokens: 2048,
        });
        return res.data.choices[0].text;
    } catch (error) {
        return null
    }
  }

module.exports = {
    data: new SlashCommandBuilder()
            .setName('gpt')
            .setDescription('Interact with an AI')
            .addStringOption(option => option.setName('text').setDescription('Ta question ?').setRequired(true)),
        execute: async (interaction) => {
            await interaction.deferReply()
            const question = interaction.options.getString('text')
            const res = await makeGPTRequest(question)
            if (res === null) return interaction.editReply({ content: 'Limite mensuelle atteinte', ephemeral: true })
            interaction.editReply({ content: `Question: ${question}\n\n${res}`})
          }
}
