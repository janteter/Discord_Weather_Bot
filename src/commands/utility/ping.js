const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Test function that replies with pong'),
    async execute(interaction) {
        await interaction.reply('This works! Pong!');
    },
};