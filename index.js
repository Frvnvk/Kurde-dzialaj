require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

const streams = {
  eska: 'https://listen.radioking.com/radio/5670/stream/320kbps',
  'rmf-fm': 'http://stream3.rmf.fm/',
  'vox-fm': 'https://vox.kielce.fm:8000/vox_kielce.mp3',
  'rmf-maxx': 'http://stream.laut.fm/rmfmaxxx',
  'melo-radio': 'https://melo.radio/stream',
  zet: 'http://zet.radio/stream',
};

const audioPlayer = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Pause,
  },
});

let connection = null;

client.once(Events.ClientReady, () => {
  console.log(`Zalogowano jako ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'pause') {
    audioPlayer.pause();
    await interaction.reply('Radio zatrzymane ⏸️');
    return;
  }

  if (commandName === 'resume') {
    audioPlayer.unpause();
    await interaction.reply('Radio wznowione ▶️');
    return;
  }

  if (!streams[commandName]) {
    await interaction.reply({ content: 'Nieznana komenda lub radio.', ephemeral: true });
    return;
  }

  // Sprawdź czy użytkownik jest na kanale głosowym
  const voiceChannel = interaction.member.voice.channel;
  if (!voiceChannel) {
    await interaction.reply({ content: 'Musisz być na kanale głosowym, aby użyć tej komendy.', ephemeral: true });
    return;
  }

  // Połącz z kanałem głosowym
  connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: interaction.guildId,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });

  const resource = createAudioResource(streams[commandName]);
  audioPlayer.play(resource);
  connection.subscribe(audioPlayer);

  await interaction.reply(`Teraz grasz: **${commandName.toUpperCase()}** 🎧`);
});

client.login(process.env.DISCORD_TOKEN);
