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

//time format for leaderboard display
String.prototype.toHHMMSS = function () {
	let sec_num = parseInt(this, 10);
	let hours   = Math.floor(sec_num / 3600);
	let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	let seconds = sec_num - (hours * 3600) - (minutes * 60);

	//if (hours   < 10) {hours   = "0"+hours;}
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

//places a 0 before minutes or seconds if the submission is only 1 digit
function prettyFormat(number) {
 	return (number.length === 1) ? `0${number}` : number.toString();
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
let racer = {};

let raceActive = false;

module.exports = {
	name: 'race',
	execute(message, args) {

		if (args[0] === 'hello' && message.author.id === '104256450607464448') {
			const helloEmbed = new Discord.MessageEmbed()
				.setColor('#3fffd9')
				.setDescription('hello my name is racebot and i am working again now hopefully,\nshoutouts to zweeks friend sye who wrote like half of my code lol');
			message.channel.send(helloEmbed);
		}

		if (args[0] === 'help') {
			return message.channel.send(helpEmbed);
		}
		if (args[0] === 'h') {
			return message.channel.send(hEmbed);
		}

		if (args[0] === 'submit' || args[0] === 's') {
			
			//let racerRole = message.guild.roles.cache.find(r => r.name === "racer");
			
			if (/^\d+:[0-5]?\d:[0-5]?\d$/.test(args[1])) {
				if (/^\d+:0?6:0?9$/.test(args[1])) {
					message.channel.send('nice');
				}

				raceActive = true;

			// hours:minutes:seconds
				time = args[1].split(':');

				racer = {
					racer: message.author,
					time: convertToSeconds(time[0], time[1], time[2])
				}

				if (racers.some(r => r.racer.id === message.author.id)) {
					for (let r of racers) {
						if (r.racer.id === message.author.id) {
							r.time = racer.time;
							break;
						}
					}
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

			//message.member.roles.add(racerRole)
			
			return message.channel.send(submitEmbedHMS);
			

			} else if (/^[0-5]?\d:[0-5]?\d$/.test(args[1])) {
				if (/^0?6:0?9$/.test(args[1])) {
					message.channel.send('nice');
				}
				
				raceActive = true;
				
			// minutes:seconds
				time = args[1].split(':');

				racer = {
					racer: message.author,
					time: convertToSeconds(0, time[0], time[1])
				}


				if (racers.some(r => r.racer.id === message.author.id)) {
					for (let r of racers) {
						if (r.racer.id === message.author.id) {
							r.time = racer.time;
							break;
						}
					}
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


			//message.member.roles.add(racerRole)
				
			return message.channel.send(submitEmbedMS);

			} else return message.react('❌');
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