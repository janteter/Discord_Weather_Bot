require('dotenv').config({ path : '/mnt/c/Personal_P/Discord_Weather_Bot/.env' });

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath); // reads path to dir and returns array of all folders within it

for (const folder of commandFolders) { // sets commands into client.commands Collection
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        }
        else {
            console.log(`[WARNING] the command at ${filePath} is missing a required "data" or "execute" property`);
        }
    }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Start refresing ${commands.length} application (/) commands.`);
        
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {body: commands},
        );

        console.log(`Successful reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
