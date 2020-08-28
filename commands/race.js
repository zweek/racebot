const Discord = require('discord.js');

const helpEmbed = new Discord.MessageEmbed()
	.setColor('#3fffd9')
	.setTitle('Available Commands')
	.addFields(
		{ name: '!race submit <HH:MM:SS> or <MM:SS>', value:'Submit your race time' },
		{ name: '!race results', value:'View the results for the current race' },
		{ name: '!race end', value:'End the current race and reset the leaderboard' },
	);

const hEmbed = new Discord.MessageEmbed()
	.setColor('#3fffd9')
	.setTitle('Available quick Commands')
	.addFields(
		{ name: '!race s <HH:MM:SS> or <MM:SS>', value:'Submit your race time' },
		{ name: '!race r', value:'View the results for the current race' },
		{ name: '!race e', value:'End the current race and reset the leaderboard' },
	);

const endEmbed = new Discord.MessageEmbed()
	.setColor('#3fffd9')
	.setDescription('Race ended and leaderboard reset');

const noraceEmbed = new Discord.MessageEmbed()
	.setColor('#3fffd9')
	.setDescription('No race in progress');

const disallowEmbed = new Discord.MessageEmbed()
	.setColor('#3fffd9')
	.setDescription('You are not allowed to do that');

function convertToSeconds(hours, minutes, seconds) {
	let h = hours * 3600;
	let m = minutes * 60;
	let s = seconds;

	return parseInt(h) + parseInt(m) + parseInt(s);
}

function prettyFormat(number) {
 	return (number.length === 1) ? `0${number}` : number.toString();
}

let racers = [];
let racer = {};

let raceActive = false;


module.exports = {
	name: 'race',
	execute(message, args) {

		if (args[0] === 'help') {
			return message.channel.send(helpEmbed);
		}
		if (args[0] === 'h') {
			return message.channel.send(hEmbed);
		}

		if (args[0] === 'submit' || args[0] === 's') {
			if (/^\d+:[0-5]?\d:[0-5]?\d$/.test(args[1])) {

				raceActive = true;

				// hours:minutes:seconds
				time = args[1].split(':');

				racer = {
					racer: message.author,
					time: convertToSeconds(time[0], time[1], time[2])
				}

				racer.racer.time = racer.time;

				if (racers.some(r => r.racer.id === message.author.id)) {

					const editEmbedHMS = new Discord.MessageEmbed()
					.setColor('#3fffd9')
					.setDescription(`<@${message.author.id}> You edited your time: ${time[0]}h ${prettyFormat(time[1])}m ${prettyFormat(time[2])}s`);

					console.log(racers);
					return message.channel.send(editEmbedHMS);
				} else racers.push(racer);

				const submitEmbedHMS = new Discord.MessageEmbed()
				.setColor('#3fffd9')
				.setDescription(`<@${message.author.id}> You submitted: ${time[0]}h ${prettyFormat(time[1])}m ${prettyFormat(time[2])}s`);

				console.log(racers);
			
			return message.channel.send(submitEmbedHMS);
			

			} else if(/^[0-5]?\d:[0-5]?\d$/.test(args[1])) {
				
				raceActive = true;
				
				// minutes:seconds
				time = args[1].split(':');

				racer = {
					racer: message.author,
					time: convertToSeconds(0, time[0], time[1])
				}

				//probably not the best way to do this, but it works
				racer.racer.time = racer.time;

				if (racers.some(r => r.racer.id === message.author.id)) {

					const editEmbedMS = new Discord.MessageEmbed()
					.setColor('#3fffd9')
					.setDescription(`<@${message.author.id}> You edited your time: ${time[0]}m ${prettyFormat(time[1])}s`);

					console.log(racers);
					return message.channel.send(editEmbedMS);
				} else racers.push(racer);

				const submitEmbedMS = new Discord.MessageEmbed()
				.setColor('#3fffd9')
				.setDescription(`<@${message.author.id}> You submitted: ${time[0]}m ${prettyFormat(time[1])}s`);

				console.log(racers);
				
				let racerRole = message.member.guild.roles.cache.find(role => role.name === "racer");
				message.member.roles.add(racerRole);
				
			return message.channel.send(submitEmbedMS);

			} else return message.react('❌');
		}

		if (args[0] === 'results' || args[0] === 'r') {
			if (raceActive === true) {

				//yoooooo i got no clue how to even start this lmao
				racers.sort(function(a, b){return a-b});
				console.log(racers);
			} else return message.channel.send(noraceEmbed);
		}

		if (args[0] === 'end' || args[0] === 'e') {
			if (racers.some(r => r.racer.id === message.author.id)) {
				if (raceActive === true) {
					racers = [];
					raceActive = false;
	
					return message.channel.send(endEmbed);
				} else return message.channel.send(noraceEmbed);
			} else return message.channel.send(disallowEmbed);
		}
	},
};