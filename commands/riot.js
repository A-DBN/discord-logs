const { SlashCommandBuilder } = require('@discordjs/builders')
const {EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const axios = require('axios')
const { createCanvas, loadImage } = require('canvas');

async function createImageGrid(images) {
    const canvasWidth = 1200;
    const canvasHeight = 800;
    const padding = 10;
    const columns = 1; // Each image on a different line, so only 1 column
    const rows = images.length; // Number of images determines the number of rows
    const imageWidth = canvasWidth - padding * 2; // Use full canvas width
    const imageHeight = (canvasHeight - padding * (rows - 1)) / rows;
  
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const context = canvas.getContext('2d');
  
    let x = padding; // Start x position with padding
    let y = padding; // Start y position with padding
  
    for (let i = 0; i < images.length; i++) {
      const image = await loadImage(images[i]);
      context.drawImage(image, x, y, imageWidth, imageHeight);
  
      y += imageHeight + padding; // Increment y position for the next image
    }
  
    return canvas.toBuffer('image/png');
  }
  

function setColor() {
    const color = Math.floor(Math.random() * 0xFFFFFF);

    if (typeof value === 'number') {
        const modifiedColor = color + value;
        const finalColor = Math.max(0, Math.min(modifiedColor, 0xFFFFFF));
        return finalColor.toString(16).padStart(6, '0');
    }
    return color.toString(16).padStart(6, '0');
}

async function getValorantWeapons()
{
    let config = {
        method: 'get',
        url: 'https://valorant-api.com/v1/weapons',
        headers: { }
    };

    return await axios.request(config).then(function (response) {
        return response.data.data
    }).catch(function (error) {
        console.error(error);
    })
}

async function global(interaction, data) {
    await interaction.deferReply();
    const weapon = interaction.options.getString('nom');
    const weaponData = data.find(w => w.displayName === weapon);
    const [wpStats, displayImage, shopData, skins] = [weaponData.weaponStats, weaponData.displayIcon, weaponData.shopData, weaponData.skins];

    const embed = new EmbedBuilder()
      .setTitle('Weapon Information')
      .setDescription('Boutton Stats: Stats de l\'arme en jeu\nBoutton Shop: Informations de l\'arme dans le shop\nBoutton Skins: Informations sur les skins')
      .setImage(displayImage)
      .setColor(setColor())

    const statsButton = new ButtonBuilder()
      .setCustomId('stats')
      .setLabel('Stats')
      .setStyle(ButtonStyle.Primary)
    const shopButton = new ButtonBuilder()
      .setCustomId('shop')
      .setLabel('Shop')
      .setStyle(ButtonStyle.Secondary)
    const skinsButton = new ButtonBuilder()
      .setCustomId('skins')
      .setLabel('Skins')
      .setStyle(ButtonStyle.Success)

      console.log(weaponData)

    const actionRow = new ActionRowBuilder()
    weapon === "Melee" ? actionRow.addComponents([skinsButton]) : actionRow.addComponents([statsButton, shopButton, skinsButton]);

    interaction.editReply({ embeds: [embed], components: [actionRow] })
      .then((message) => {
        const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', (buttonInteraction) => {
            embed.data.fields = [];
            switch (buttonInteraction.customId) {
                case 'stats':
                    const { fireRate, magazineSize, reloadTimeSeconds, wallPenetration, damageRanges } = weaponData.weaponStats;
                
                    embed.setDescription('Stats Page');
                    embed.addFields(
                    { name: 'Fire Rate', value: fireRate.toString(), inline: true },
                    { name: 'Magazine Size', value: magazineSize.toString(), inline: true },
                    { name: 'Reload Time', value: reloadTimeSeconds.toString(), inline: true },
                    { name: 'Wall Penetration', value: wallPenetration.split(':')[2], inline: true },
                    );
                    damageRanges.forEach(range => {
                    const rangeText = `Range: ${range.rangeStartMeters}-${range.rangeEndMeters}\nHead Damage: ${range.headDamage}\nBody Damage: ${range.bodyDamage}\nLeg Damage: ${range.legDamage}`;
                    embed.addFields({name:'Damage Range', value:rangeText});
                    });
                    break;
                case 'shop':
                embed.setDescription('Shop Page');
                        embed.addFields(
                            { name: 'Catégorie', value: shopData.category, inline: true },
                            { name: 'Prix', value: shopData.cost.toString(), inline: true },
                            { name: `Positon dans la grille`, value: `${shopData.gridPosition.row}-${shopData.gridPosition.column}`, inline: true}
                        )
                break;
                case 'skins':
                embed.setDescription('Skins Page\n' + skins.map(skin => skin.displayName).join('\n'));
                // embed.addFields(
                //     {
                //         name: 'Skins',
                //         value: skins.map(skin => skin.displayName).join('\n'),
                //     }
                // )
                break;
            }
            buttonInteraction.update({ embeds: [embed]});
            });

        collector.on('end', () => {
            actionRow.components.forEach((button) => button.setDisabled(true));
            interaction.editReply({ components: [actionRow] });
        });
    })
    .catch(console.error);
}

async function showSkin(interaction, data) {
    await interaction.deferReply();
    const name = interaction.options.getString('nom');
    const skins = data.map(w => w.skins).flat().filter(s => s.displayName === name);
    const chromas = skins.map(s => s.chromas).flat();
    if (chromas.length === 1) {
        const embed = new EmbedBuilder()
            .setTitle(name)
            .setColor(setColor())
            .addFields({name: 'Default Skin', value: skins[0].displayName, inline: false})
            .setImage(skins[0].displayIcon)
            .setTimestamp()
            .setFooter({text: 'No chroma found for this skin'})
        return await interaction.editReply({ embeds: [embed] });
    }
    const images = chromas.map(c => c.fullRender);
    if (chromas.length === 0 || images.length === 0) return await interaction.editReply({ content: 'Aucun Chroma trouvé. Pour obtenir la liste des skins d\'une arme /valorant arme puis menu Skins' });
    const image = await createImageGrid(images);
    const embed = new EmbedBuilder()
        .setTitle(name)
        .setImage('attachment://image.png')
        .setColor(setColor())
        .setTimestamp()
        .addFields({ name: 'Chromas in the image order:', value: " ", inline: false})
    
    chromas.forEach(chroma => {
        embed.addFields({ name: chroma.displayName, value: chroma.fullRender, inline: false})
    })
    
    await interaction.editReply({ embeds: [embed], files: [{ attachment: image, name: 'image.png' }] });
}

module.exports = {
    data: new SlashCommandBuilder()
            .setName('valorant')
            .setDescription('Commandes Valorant')
            .addSubcommand(subcommand => subcommand
                .setName('arme')
                .setDescription('Affiche les informations d\'une arme')
                .addStringOption(option => option.setName('nom').setDescription('Nom de l\'arme').setAutocomplete(true).setRequired(true))
            )
            .addSubcommand(subcommand => subcommand
                .setName('skin')
                .setDescription('Affiche les informations d\'un skin')
                .addStringOption(option => option.setName('nom').setDescription('Nom du skin').setRequired(true))
            ),
        autocomplete: async (interaction) => {
            const focusedValue = interaction.options.getFocused(true);
            const choices = ["Odin", "Ares", 'Vandal', "Bulldog", "Guardian", "Phantom", "Spectre", "Stinger", "Marshal", "Operator", "Shorty", "Frenzy", "Ghost", "Sheriff", "Bucky", "Judge", "Classic", "Melee"];
            const filtered = choices.filter(choice => choice.startsWith(focusedValue.value));
            await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
        },
        execute: async (interaction) => {
            const data = await getValorantWeapons();
            if (interaction.options.getSubcommand() === 'arme') {
                await global(interaction, data);
            } else if (interaction.options.getSubcommand() === 'skin') {
                await showSkin(interaction, data);
            }
        }
}
