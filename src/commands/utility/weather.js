// const { SlashCommandBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
require("dotenv").config({ path : '/mnt/c/Personal_P/Discord_Weather_Bot/.env' });
const axios = require('axios');
const { Message } = require('discord.js');

const WeatherAPI = process.env.WEATHER_ID
console.log(WeatherAPI)

module.exports = {
    data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('returns weather data for given location')
    .addStringOption( option => option.setName('location').setDescription('target location').setRequired(true))
    .addStringOption( option => option.setName('temperature-unit').setDescription('Desired temperature output').setRequired(true).addChoices({ name: 'Celsius', value: 'C'}, { name: 'Fahrenheit', value: 'F'})),
    
    async execute(interaction) {
        const location = interaction.options.getString('location');
        const degree = interaction.options.getString('temperature-unit');
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${WeatherAPI}`

        console.log(`The location given is ${location} and the temperature unit is: ${degree}`);
        try{
            const geoResponse = await axios.get(url);
            const { lat, lon } = geoResponse.data[0];
            if (typeof lat === 'undefined' || typeof lon === 'undefined') {
                Message.channel.send('Could not find longitude or latitude of given city. Try again');
                return;
            }
            console.log(`Lat returned: ${lat}, lot returned: ${lon}`)
        } catch (error) {
            console.log(error);
            Message.channel.reply('Could not fetch data. Try again');
        }

        //console.log(`Lat returned: ${lat}, lot returned: ${lon}`)


    },
}