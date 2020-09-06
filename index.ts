const fs = require('fs');
import Discord from 'discord.js'
const { prefix, token } = require('./config.json');



// createConnection({

//     type: "sqlite",
//     database: './db/db.sql',
//     entities: [
//         __dirname + "/entity/*.js"
//     ],
//     synchronize: true,
// }).then(async connection => {
// 	// here you can start to work with your entities
// 	let racer = new Racer();
//     racer.name = "Me and Bears";
//     racer.description = "I am near polar bears";
//     racer.filename = "photo-with-bears.jpg";
//     racer.views = 1;
//     racer.isPublished = true;

//     await connection.manager.save(racer);
//     console.log("Racism has been saved");


// }).catch(error => console.log(error));

class Commands extends Discord.Client {
	commands: any;
	constructor() {
		super();
		this.commands = new Discord.Collection();
	}
}

const bot = new Commands();


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