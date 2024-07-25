const { SlashCommandBuilder } = require('@discordjs/builders');
require("dotenv").config({ path : '/mnt/c/Personal_P/Discord_Weather_Bot/.env' });
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

const WeatherAPI = process.env.WEATHER_ID;
console.log(WeatherAPI);