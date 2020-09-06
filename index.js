"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var fs = require('fs');
var discord_js_1 = require("discord.js");
var _a = require('./config.json'), prefix = _a.prefix, token = _a.token;
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
var Commands = /** @class */ (function (_super) {
    __extends(Commands, _super);
    function Commands() {
        var _this = _super.call(this) || this;
        _this.commands = new discord_js_1["default"].Collection();
        return _this;
    }
    return Commands;
}(discord_js_1["default"].Client));
var bot = new Commands();
var commandFiles = fs.readdirSync('./commands').filter(function (file) { return file.endsWith('.js'); });
for (var _i = 0, commandFiles_1 = commandFiles; _i < commandFiles_1.length; _i++) {
    var file = commandFiles_1[_i];
    var command = require("./commands/" + file);
    bot.commands.set(command.name, command);
}
bot.once('ready', function () {
    console.log('READY');
    bot.user.setActivity('!race help / !race h');
});
bot.on('message', function (message) {
    if (!message.content.startsWith(prefix) || message.author.bot || message.channel.name != 'races') {
        return;
    }
    var args = message.content.slice(prefix.length).trim().split(/ +/);
    var command = args.shift().toLowerCase();
    if (!bot.commands.has(command))
        return;
    try {
        bot.commands.get(command).execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.channel.send('oops');
    }
});
bot.login(token);
