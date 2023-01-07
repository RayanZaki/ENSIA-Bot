const { REST, SlashCommandBuilder, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('verify').setDescription('Automated check for ENSIA students using the correct full name.')
	.addStringOption(option => 
		option.setName('email')
		.setDescription('Give your proffesional email ( @ensia.edu.dz )')
		.setRequired(true))
]
	.map(command => command.toJSON());

	// commands.push({
	// 	name : "easter-egg",
	// 	description: "YAY!! You have reached the final step for this challenge!\nCongratulations:partying_face:"
	// });

	
const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);