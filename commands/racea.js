const Discord = require('discord.js');

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

let bannedRacers = [];

module.exports = {
	name: 'racea',
	execute(message, args) {
		
		//this creates an error: Cannot use import statement outside a module, dont know how to fix :(
		//import { racers } from './race'
		
		if (
		!message.member.roles.cache.some((role) => role.name === 'racemod') &&
		!message.member.roles.cache.some((role) => role.name === 'Speedrun.com Mod')
		) return


		if (args[0] === 'help') {
			return message.channel.send(adminhelpEmbed);
		}
		if (args[0] === 'h') {
			return message.channel.send(adminhEmbed);
		}

		if (args [0] === 'add' || args[0] === 'a') {
			if (args[1] === 'user') {
				if (/^\d+:[0-5]?\d:[0-5]?\d$/.test(args[2])) {

					return message.channel.send(
						new Discord.MessageEmbed()
						.setColor('#3fffd9')
						.setDescription("Added [USER] to current race with [hmsTIME]")
					);
				} else if (/^[0-5]?\d:[0-5]?\d$/.test(args[2])) {

					return message.channel.send(
						new Discord.MessageEmbed()
						.setColor('#3fffd9')
						.setDescription("Added [USER] to current race with [msTIME]")
					);
				} else return message.channel.send(noTimeEmbed);
			} else return message.channel.send(noUserEmbed);
		}

		if (args [0] === 'edit' || args[0] === 'e') {
			if (args[1] === 'user') {
				if (/^\d+:[0-5]?\d:[0-5]?\d$/.test(args[2])) {

					return message.channel.send(
						new Discord.MessageEmbed()
						.setColor('#3fffd9')
						.setDescription("Edited [USER]'s time to [hmsTIME]")
					);
				} else if (/^[0-5]?\d:[0-5]?\d$/.test(args[2])) {

					return message.channel.send(
						new Discord.MessageEmbed()
						.setColor('#3fffd9')
						.setDescription("Edited [USER]'s time to [msTIME]")
					);
				} else return message.channel.send(noTimeEmbed);
			} else return message.channel.send(noUserEmbed);
		}

		if (args[0] === 'clear' || args[0] === 'c') {
			racers = [];
			raceActive = false;
			return message.channel.send(
				new Discord.MessageEmbed()
				.setColor('#3fffd9')
				.setDescription('Race leaderboard cleared and reset')
			);
		}

		if (args [0] === 'remove' || args[0] === 'r') {
			if (args[1] === 'user') {

				return message.channel.send(
					new Discord.MessageEmbed()
					.setColor('#3fffd9')
					.setDescription('Removed [USER] from the current race')
				);
			} else return message.channel.send(noUserEmbed);			
		}

		if (args[0] === 'ban' || args[0] === 'b') {
			if (args[1] === 'user') {

				bannedRacers.push();

				return message.channel.send(
					new Discord.MessageEmbed()
					.setColor('#3fffd9')
					.setDescription('Banned [USER] from participating in future races')
				);
			}		
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