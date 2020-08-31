const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

bot.once('ready', () => {
	console.log('READY');
	bot.user.setActivity('!race help / !race h');
});

bot.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot || message.channel.name != 'races') {
		return;
	}

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!bot.commands.has(command)) return;

	try {
		bot.commands.get(command).execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.channel.send('oops');
	}
});

bot.login(token);