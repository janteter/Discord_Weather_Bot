require("dotenv").config();
console.log(process.env);

const fs = require('node:fs');
const path = require('node:path');
const {Client, GatewayIntentBits, Collection, Events} = require('discord.js');
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath); // reads path to dir and returns array of all folders within it

for (const folder of commandFolders) { // sets commands into client.commands Collection
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.command.set(command.data.name, command);
        }
        else {
            console.log(`[WARNING] the command at ${filePath} is missing a required "data" or "execute" property`);
        }
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if(!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);

    } catch (error) {
        console.error(error);
        if(interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command', ephemeral: true});
        } else {
            await interaction.reply({ content: 'There was an error while executing this command', ephemeral: true});
        }
    }

});

client.on("ready", (x)=> {
    console.log(`${x.user.tag} is ready!`);
    client.user.setActivity('I am alived');
})


client.login(process.env.TOKEN)
