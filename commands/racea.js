const Discord = require('discord.js');

const JSONdb = require('simple-json-db');
const db = new JSONdb('db/racedb.json');

const adminhelpEmbed = new Discord.MessageEmbed()
	.setColor('#3fffd9')
	.setTitle('Available Admin Commands')
	.addFields(
		{ name: '!racea add <username>', value:'Add a user from the current race' },
		{ name: '!racea edit <username>', value:"Edit a user's time" },
		{ name: '!racea remove <username>', value:'Remove a user from the current race' },
		{ name: '!racea clear', value:'Clear all users from the current race' },
		{ name: '!racea ban <username>', value:'Ban a user from submitting to future races' },
		{ name: '!racea pardon <username>', value:'Unban a user so they may submit to races again' },
	);

const adminhEmbed = new Discord.MessageEmbed()
	.setColor('#3fffd9')
	.setTitle('Available Quick Admin Commands')
	.addFields(
		{ name: '!racea a <username>', value:'Add a user from the current race' },
		{ name: '!racea e <username>', value:"Edit a user's time" },
		{ name: '!racea r <username>', value:'Remove a user from the current race' },
		{ name: '!racea c', value: 'Clear all users from the current race' },
		{ name: '!racea b <username>', value:'Ban a user from submitting to future races' },
		{ name: '!racea p <username>', value:'Unban a user so they may submit to races again' },
	);

const disallowEmbed = new Discord.MessageEmbed()
	.setColor('#3fffd9')
	.setDescription('You are not allowed to do that');

const noUserEmbed = new Discord.MessageEmbed()
	.setColor('#3fffd9')
	.setDescription('You must specify a user');

const noTimeEmbed = new Discord.MessageEmbed()
	.setColor('#3fffd9')
	.setDescription('You must specify a time');

const noRaceEmbed = new Discord.MessageEmbed()
	.setColor('#3fffd9')
	.setDescription('No race in progress');

let racers = db.get('racers');

module.exports = {
	name: 'racea',
	execute(message, args) {
				
		if (
		!message.member.roles.cache.some((role) => role.name === 'racemod') &&
		!message.member.roles.cache.some((role) => role.name === 'Speedrun.com Mod')
		) return message.channel.send(disallowEmbed);


		if (args[0] === 'help') {
			return message.channel.send(adminhelpEmbed);
		}
		if (args[0] === 'h') {
			return message.channel.send(adminhEmbed);
		}

		if (args [0] === 'add' || args[0] === 'a') {
			if (args[1] === 'user') {
				if (/^(\d+)?:?[0-5]?\d:[0-5]?\d$/.test(args[2])) {

					return message.channel.send(
						new Discord.MessageEmbed()
						.setColor('#3fffd9')
						.setDescription("Added [USER] to current race with [hmsTIME]")
					);
				} else return message.channel.send(noTimeEmbed);
			} else return message.channel.send(noUserEmbed);
		}

		if (args [0] === 'edit' || args[0] === 'e') {
			if (args[1] === 'user') {
				if (/^(\d+)?:?[0-5]?\d:[0-5]?\d$/.test(args[2])) {

					return message.channel.send(
						new Discord.MessageEmbed()
						.setColor('#3fffd9')
						.setDescription("Edited [USER]'s time to [hmsTIME]")
					);
				} else return message.channel.send(noTimeEmbed);
			} else return message.channel.send(noUserEmbed);
		}

		if (args[0] === 'clear' || args[0] === 'c') {
			if(db.storage.raceActive === true) {

				db.set('racers', []);
				db.set('raceActive', false);

				return message.channel.send(
					new Discord.MessageEmbed()
					.setColor('#3fffd9')
					.setDescription('Race leaderboard cleared and reset')
				);
			} else return message.channel.send(noRaceEmbed);
		}

		if (args [0] === 'remove' || args[0] === 'r') {
			if(!message.mentions.users.size) {
				return message.channel.send(noUserEmbed);			
			}
			
			//dunno bout this, it clears all racers instead of just one
			const taggedUser = message.mentions.users.first();

				db.get('racer')
				racers.filter(r => r.racer.id != taggedUser.id);
				db.set('racers', racers);

				return message.channel.send(
					new Discord.MessageEmbed()
					.setColor('#3fffd9')
					.setDescription(`Removed ${taggedUser.username} from the current race`)
				);
		}

		if (args[0] === 'ban' || args[0] === 'b') {
			if(!message.mentions.users.size) {
				return message.channel.send(noUserEmbed);			
			}

				return message.channel.send(
					new Discord.MessageEmbed()
					.setColor('#3fffd9')
					.setDescription('Banned [USER] from participating in future races')
				);
					
		}

		if (args[0] === 'pardon' || args[0] === 'p') {
			if (args[1] === 'user') {
				
				return message.channel.send(
					new Discord.MessageEmbed()
					.setColor('#3fffd9')
					.setDescription('Unbanned [USER] from participating in races')
				);
			} else return message.channel.send(noUserEmbed);
		}
	},
};