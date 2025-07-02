require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder().setName('eska').setDescription('Włącz radio Eska'),
  new SlashCommandBuilder().setName('rmf-fm').setDescription('Włącz radio RMF FM'),
  new SlashCommandBuilder().setName('vox-fm').setDescription('Włącz radio Vox FM Kielce'),
  new SlashCommandBuilder().setName('rmf-maxx').setDescription('Włącz radio RMF Maxxx'),
  new SlashCommandBuilder().setName('melo-radio').setDescription('Włącz radio Melo Radio'),
  new SlashCommandBuilder().setName('zet').setDescription('Włącz radio Zet'),
  new SlashCommandBuilder().setName('pause').setDescription('Zatrzymaj radio'),
  new SlashCommandBuilder().setName('resume').setDescription('Wznów radio'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Deploying slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );
    console.log('Slash commands deployed!');
  } catch (error) {
    console.error(error);
  }
})();
