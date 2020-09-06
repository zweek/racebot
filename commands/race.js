const Discord = require('discord.js');

//databases
const JSONdb = require('simple-json-db');
const db = new JSONdb('db/racedb.json');
const adb = new JSONdb('db/admindb.json', {asyncWrite: true});
const sdb = new JSONdb('db/statsdb.json');

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

const noraceEmbed = new Discord.MessageEmbed()
.setColor('#3fffd9')
.setDescription('No race in progress')

const disallowEmbed = new Discord.MessageEmbed()
.setColor('#3fffd9')
.setDescription('You are not allowed to do that')

//time format for display
String.prototype.toHHMMSS = function () {
	let sec_num = parseInt(this, 10);
	let hours   = Math.floor(sec_num / 3600);
	let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	let seconds = sec_num - (hours * 3600) - (minutes * 60);

	if (minutes < 10 && hours > 0) {minutes = "0"+minutes;}
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

let bannedRacers = [];

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

			bannedRacers = adb.get('bannedRacers');

			if (bannedRacers.some(r => r.user.id === message.author.id)) {
				return message.channel.send(
					new Discord.MessageEmbed()
					.setColor('#3fffd9')
					.setDescription(`You are currently banned from participating in races`)
				)
			}
		
			if (/^(\d+)?:?[0-5]?\d:[0-5]?\d$/.test(args[1])) {
				
				if (/^(\d+)?:?0?6:0?9$/.test(args[1]) || /^(\d+)?:?[0-5]?4:20$/.test(args[1])) {
					message.channel.send('nice');
				}

				if (!message.member.roles.cache.some((role) => role.name === 'racer')) {
					let racerRole = message.guild.roles.cache.find(r => r.name === "racer");
					message.member.roles.add(racerRole)
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
							db.set('racers', racers);
							break;
						}
					}

					const editEmbedHMS = new Discord.MessageEmbed()
					.setColor('#3fffd9')
					.setDescription(`<@${message.author.id}> You edited your time: ${racer.time.toString().toHHMMSS()}`)

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

		if (/^(\d+)?:?[0-5]?\d:[0-5]?\d$/.test(args[0])) {
			return message.react('❌');
		}

		if (args[0] === 'results' || args[0] === 'r') {
			if (db.storage.raceActive === true) {
				racers.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0)); 
				let m = "";
				let number = "";

				for (let i in racers) {
					switch (i) {
						case '0':
							number = '🥇'
							break;
						case '1':
							number = '🥈'
							break;
						case '2':
							number = '🥉'
							break;

						default:
							number = ordinalSuffixOf(parseInt(i)+1);
						
					}
					
					m = m + `${number} <@${racers[i].racer.id}> - ${racers[i].time.toString().toHHMMSS()}\n`
				}

				message.channel.send(
					new Discord.MessageEmbed()
						.setTitle('Race results')
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
				if (db.storage.raceActive === true) {
					racers = [];
					db.set('racers', []);
					db.set('raceActive', false);
	
					return message.channel.send(
						new Discord.MessageEmbed()
						.setColor('#3fffd9')
						.setDescription('Race ended and leaderboard reset')
					);
				} else return message.channel.send(noraceEmbed);
			} else return message.channel.send(disallowEmbed);
		}

		if (args[0] === 'info' || args[0] === 'i') {
			const infoEmbed = new Discord.MessageEmbed()
				.setColor('#3fffd9')
				.setThumbnail('https://cdn.discordapp.com/avatars/720044162178613350/97a70062b055235c477f732730dc85db.webp')
				.setTitle('Racebot info')
				.setDescription('Racebot is a simple bot that you can use\nto quickly set up leaderboards for speedrun races')
				.addFields(
					{ name: 'written by', value:'**zweek**#1296 and **Sye**#0808' },
					{ name: 'GitHub page', value:'https://github.com/zweek/racebot' },
				);
			message.channel.send(infoEmbed);
		}
	},
};