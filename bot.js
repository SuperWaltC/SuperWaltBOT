const botsettings = require("./botsettings.json");
const Discord = require("discord.js");
const prefix = botsettings.prefix

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
	console.log(`${bot.user.username} is ready!`);

    try {
		let link = await bot.generateInvite(["ADMINISTRATOR"]);
		console.log(link);
 	} catch(e) {
			console.log(e.stack);
   	}
});

bot.on("message", async message => {
		if(message.author.bot) return;
		if(message.channel.type === "dm") return;

		let messageArray = message.content.split(" ");
		let command = messageArray[0];
		let args = messageArray.slice(1);

		if(!command.startsWith(prefix)) return;

		if(command === `${prefix}userinfo`) {
			let embed = new Discord.RichEmbed()
			.setAuthor(message.author.username)
			.setDescription("This is the user's info!")
			.setColor("#00FFF7")
			.addField("Full username", `${message.author.username}#${message.author.discriminator}`)
			.addField("ID", message.author.id)
			.addField("Created At", message.author.createdAt);

			message.channel.send(embed);

			return;

		}

		if(command === `${prefix}mute`) {
				if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("You do not have permission")


			let toMute = message.guild.menmber (message.mentions.users.first() || message.guild.members.get(args[0]));
			if(!toMute) return message.channel.sendMessage("You did not specify a user mention or ID");

	 let role = message.guild.roles.find(r => r.name === "SWB Muted")
	 if(!role) {}
	 try{
	   role = await message.guild.createRole({
						 name: "SWB Muted",
						 color: "#FF0000",
						 permissions: []
					});

					message.guild.channels.forEach(async (channel, id) => {
							await channel.overwritePermissions(role, {
						  	 	SEND_MESSAGES: false,
								ADD_REACTIONS: false
						});
					});
			}	catch(e) {
					console.log(e.stack);
 			}

			if(toMute.roles.has(role.id)) return message.channel.send("This user is already muted!!!");

			await toMute.addRole(role);
			message.channel.send("I have muted them :)");

			return;

		 }
	});

bot.login(process.env.BOT_TOKEN);
