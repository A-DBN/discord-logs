const { SlashCommandBuilder } = require('@discordjs/builders')
const { createCanvas, loadImage } = require('canvas');


module.exports = {
        data: new SlashCommandBuilder()
            .setName('coinflip')
            .setDescription('Joue au pile ou face')
            .addStringOption(option => option.setName('side').setDescription('Pile ou Face').setRequired(true).addChoices({name: 'Pile', value: 'Pile'}, {name: 'Face', value: 'Face'})),
        execute: async (interaction) => {
            const sides = ['Pile', 'Face'];
            const randomSide = sides[Math.floor(Math.random() * sides.length)];
            const userSide = interaction.options.getString('side');
            const canvas = createCanvas(200, 200);
            const ctx = canvas.getContext('2d');
        
            ctx.beginPath();
            ctx.arc(100, 100, 80, 0, 2 * Math.PI);
            ctx.fillStyle = '#cfae5f';
            ctx.fill();
        
            ctx.font = 'bold 40px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(randomSide, 100, 100);
        
            const attachment = canvas.toBuffer();
            return randomSide !== userSide ? interaction.reply({ content: 'Côté séléctionné: ' + userSide + `\nRésultat: Perdu`, files: [attachment] }) : interaction.reply({ content: 'Côté séléctionné: ' + userSide + `\nRésultat: Gagné`, files: [attachment] });
          }          
}
