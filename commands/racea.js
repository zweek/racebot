const Discord = require('discord.js');
let { racers, racer } = require ('./race.js')

const adminhelpEmbed = new Discord.MessageEmbed()
	.setColor('#3fffd9')
	.setTitle('Available Admin Commands')
	.addFields(
		{ name: '!racea remove <username>', value:'Remove a user from the current race' },
		{ name: '!racea clear', value:'Clear all users from the current race' },
		{ name: '!racea ban <username>', value:'Ban a user from submitting to future races' },
		{ name: '!racea pardon <username>', value:'Unban a user so they may submit to races again' },
	);

const adminhEmbed = new Discord.MessageEmbed()
	.setColor('#3fffd9')
	.setTitle('Available Quick Admin Commands')
	.addFields(
		{ name: '!racea r <username>', value:'Remove a user from the current race' },
		{ name: '!racea c', value: 'Clear all users from the current race' },
		{ name: '!racea b <username>', value:'Ban a user from submitting to future races' },
		{ name: '!racea p <username>', value:'Unban a user so they may submit to races again' },
	);

const disallowEmbed = new Discord.MessageEmbed()
	.setColor('#3fffd9')
	.setDescription('You are not allowed to do that');

module.exports = {
	name: 'racea',
	execute(message, args) {
		//if (!message.member.roles.cache.some((role) => role.name === 'raceadmin')) return message.channel.send(disallowEmbed)

		if (args[0] === 'help') {
			return message.channel.send(adminhelpEmbed);
		}
		if (args[0] === 'h') {
			return message.channel.send(adminhEmbed);
		}

		if (args[0] === 'clear' || args[0] === 'c') {
			racers = [];
		}
		
	},
};