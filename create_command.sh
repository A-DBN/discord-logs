#!/bin/bash

template_target() {
    echo "oui"
    echo "const { SlashCommandBuilder } = require('@discordjs/builders')
const {MessageEmbed} = require('discord.js')
const env = require('dotenv').config()

module.exports = {
    data: new SlashCommandBuilder()
            .setName('$1')
            .setDescription('$2')
            .addUserOption(option => option.setName('target').setRequired(false).setDescription('Choisis un utilisateur')),
        execute: async (interaction) => {
            const username = interaction.user.username
            const user = interaction.options.getUser('target')
            return interaction.reply(\`\${user}: $3\`)
        }
}
" > ./commands/$1.js
}

template_message() {
        echo $1 $2 $3
    echo "non"
    echo "const { SlashCommandBuilder } = require('@discordjs/builders')
const {MessageEmbed} = require('discord.js')
const env = require('dotenv').config()

module.exports = {
    data: new SlashCommandBuilder()
            .setName('$1')
            .setDescription('$2'),
        execute: async (interaction) => {
            const username = interaction.user.username
            return interaction.reply(\`$3\`)
        }
}
" > ./commands/$1.js
}

#Args
# 1: type
# 2: name
# 3: description
# 4: content

main() {
    echo $1 $2 $3 $4
    case $1 in
        "target")
            template_target $2 $3 $4
            ;;
        "message")
            template_message $2 $3 $4
            ;;
        *)
            echo "Invalid type"
            ;;
    esac
}

main $1 $2 $3 $4