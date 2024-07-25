// const { SlashCommandBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
require("dotenv").config({ path : '/mnt/c/Personal_P/Discord_Weather_Bot/.env' });
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

const WeatherAPI = process.env.WEATHER_ID;
console.log(WeatherAPI);

module.exports = {
    data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('returns weather data for given location')
    .addStringOption( option => option.setName('location').setDescription('target location').setRequired(true))
    .addStringOption( option => option.setName('temperature-unit').setDescription('Desired temperature output').setRequired(true).addChoices({ name: 'Celsius', value: 'metric'}, { name: 'Fahrenheit', value: 'imperial'})),
    
    async execute(interaction) {
        const location = interaction.options.getString('location');
        const degree = interaction.options.getString('temperature-unit');
        console.log(`${degree}`);
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${WeatherAPI}`;

        console.log(`The location given is ${location} and the temperature unit is: ${degree}`);
        try{
            const geoResponse = await axios.get(url);
            const { lat, lon } = geoResponse.data[0];
            if (typeof lat === 'undefined' || typeof lon === 'undefined') {
                interaction.channel.send('Could not find longitude or latitude of given city. Try again');
                return;
            }
            console.log(`Lat returned: ${lat}, lot returned: ${lon}`)

            const locUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WeatherAPI}&units=${degree}`;
            console.log(`${locUrl}`);
            const weatherResponse = await axios.get(locUrl);
            const weatherJSON = weatherResponse.data;
            if (weatherJSON === undefined) {
                console.log(`No data returned, API call data is undefined`);
            }

            const temp = weatherJSON.main.temp;
            const feelsLike = weatherJSON.main.feels_like;
            const conditions = weatherJSON.weather[0].main;
            const condDescription = weatherJSON.weather[0].description;
            const humidity = weatherJSON.main.humidity;
            const windSpeed = weatherJSON.wind.speed;

            const weatherEmbed = new EmbedBuilder() 
                .setColor(0x0099FF)
                .setTitle(`${location}`)
                .addFields(
                    {name: 'Current Temperature', value: `${temp}`},
                    {name: 'Feels Like', value: `${feelsLike}`},
                    {name: 'Current Conditions', value: `${conditions}`},
                    {name: 'Condition Description', value: `${condDescription}`},
                    {name: 'Humidity', value: `${humidity}`},
                    {name: 'Wind Speed', value: `${windSpeed}`}
                );

            interaction.channel.send({ embeds: [weatherEmbed] });
            
        } catch (error) {
            console.log(error);
            interaction.channel.reply('Could not fetch data. Try again');
        }
    },
}