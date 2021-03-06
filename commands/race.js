const Discord = require('discord.js');

const JSONdb = require('simple-json-db');
const db = new JSONdb('db/racedb.json');

const helpEmbed = new Discord.MessageEmbed()
	.setColor('#3fffd9')
	.setTitle('Available Commands')
	.addFields(
		{ name: '!race submit <HH:MM:SS> or <MM:SS>', value:'Submit your race time' },
		{ name: '!race results', value:'View the results for the current race' },
		{ name: '!race end', value:'End the current race and reset the leaderboard' },
		{ name: '!race info', value:'Show info about Racebot' },
	);

const hEmbed = new Discord.MessageEmbed()
	.setColor('#3fffd9')
	.setTitle('Available quick Commands')
	.addFields(
		{ name: '!race s <HH:MM:SS> or <MM:SS>', value:'Submit your race time' },
		{ name: '!race r', value:'View the results for the current race' },
		{ name: '!race e', value:'End the current race and reset the leaderboard' },
		{ name: '!race i', value:'Show info about Racebot' },
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

//time format for leaderboard display
String.prototype.toHHMMSS = function () {
	let sec_num = parseInt(this, 10);
	let hours   = Math.floor(sec_num / 3600);
	let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	let seconds = sec_num - (hours * 3600) - (minutes * 60);

	if (minutes < 10) {minutes = "0"+minutes;}
	if (seconds < 10) {seconds = "0"+seconds;}
	if (hours === 0) {
		return minutes + ':' + seconds;
	} else {
		return hours + ':' + minutes + ':' + seconds;
	}
}

//converts the HH:MM:SS format into total number of seconds
function convertToSeconds(hours, minutes, seconds) {
	let h = hours * 3600;
	let m = minutes * 60;
	let s = seconds;

	return parseInt(h) + parseInt(m) + parseInt(s);
}

//adds proper suffixes for the leaderboard placements, and ignores 11, 12, 13
function ordinalSuffixOf(i) {
    let j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

let racers = [];

db.set('racers', []);

db.set('raceActive', false);

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

			let timeFormat = '';

			if (!message.member.roles.cache.some((role) => role.name === 'racer')) {
				let racerRole = message.guild.roles.cache.find(r => r.name === "racer");
				message.member.roles.add(racerRole)
			}
			
			if (/^(\d+)?:?[0-5]?\d:[0-5]?\d$/.test(args[1])) {
				timeFormat = 'hms'
				
				if (/^(\d+)?:?0?6:0?9$/.test(args[1]) || /^(\d+)?:?[0-5]?4:20$/.test(args[1])) {
					message.channel.send('nice');
				}
				
				time = args[1].split(':');
				
				let racer = {
					racer: message.author,
					time: (time.length === 2) ? convertToSeconds(0, time[0], time[1]) : convertToSeconds(time[0], time[1], time[2])
				}

			
			db.set('raceActive', true);

			racers = db.get('racers');
				

			if (racers.some(r => r.racer.id === message.author.id)) {
				for (let r of racers) {
					if (r.racer.id === message.author.id) {
						r.time = racer.time;
						break;
					}
				}

				const editEmbedHMS = new Discord.MessageEmbed()
				.setColor('#3fffd9')
				.setDescription(`<@${message.author.id}> You edited your time: ${racer.time.toString().toHHMMSS()}`)

				console.log(racers);
				return message.channel.send(editEmbedHMS);
			} else {
				racers.push(racer);
				db.set('racers', racers);
			} 

			const submitEmbedHMS = new Discord.MessageEmbed()
			.setColor('#3fffd9')
			.setDescription(`<@${message.author.id}> You submitted: ${racer.time.toString().toHHMMSS()}`);

			console.log(racers)

			
			return message.channel.send(submitEmbedHMS);
			
			} else {
				return message.react('❌');
			}
		}

		if (args[0] === 'results' || args[0] === 'r') {
			if (raceActive === true) {
				racers.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0)); 
				let m = "";
				let number = "";
				let racetime = "";

				for (let i in racers) {
					switch (i) {
						case '0':
							number = '🥇'
							console.log(1);
							break;
						case '1':
							number = '🥈'
							console.log(2);
							break;
						case '2':
							number = '🥉'
							console.log(3);
							break;

						default:
							number = ordinalSuffixOf(parseInt(i)+1);
						
					}
					
					m = m + `${number} <@${racers[i].racer.id}> - ${racers[i].time.toString().toHHMMSS()}\n`
				}

				message.channel.send(
					new Discord.MessageEmbed()
						.setColor('#3fffd9')
						.setDescription(m));
				
			} else return message.channel.send(noraceEmbed);
		}

		if (args[0] === 'end' || args[0] === 'e') {
			if (
			racers.some(r => r.racer.id === message.author.id) ||
			message.member.roles.cache.some((role) => role.name === 'racemod') ||
			message.member.roles.cache.some((role) => role.name === 'Speedrun.com Mod')
			) {
				if (raceActive === true) {
					racers = [];
					raceActive = false;
	
					return message.channel.send(endEmbed);
				} else return message.channel.send(noraceEmbed);
			} else return message.channel.send(disallowEmbed);
		}

		if (args[0] === 'info' || args[0] === 'i') {
			const infoEmbed = new Discord.MessageEmbed()
				.setColor('#3fffd9')
				.setTitle('Racebot info')
				.addFields(
					{ name: 'written by', value:'**zweek**#1296 and **Sye**#0808' },
					{ name: 'GitHub page', value:'https://github.com/zweek/racebot' },
				);
			message.channel.send(infoEmbed);
		}
	},
};