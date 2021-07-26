import * as Discord from 'discord.js';
import {registry, ThreadInstance} from './ThreadManager';
import {config,options} from './config.example';
import fs from 'fs';
import {token} from './shhh.json';

const client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
});

client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

client.once(
	"ready",
	async () => {
		console.log("Ready!");
		client.user.setActivity("for messages in #forum", {type: "WATCHING"});
		let msgChan = await client.channels.fetch(config.hostChannel);
		setInterval(
			async function() {
				let msgs = await msgChan.messages.fetch();
				for (const msg of msgs.array()) {
					if (msg.id == config.hostMsg) {
						continue;
					}
					if (Date.now() - msg.createdAt < 30_000) {
						continue;
					}
					await msg.delete();
				}
			},
			10_000,
		);
	},
);

client.on(
	"message",
	(message: Discord.Message) => {
		if (message.content.startsWith(config.prefix)) {
			const args = message.content.slice(config.prefix.length).trim().split(/ +/);
			const command = args.shift().toLowerCase();
			try {
				let maycommand = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
				maycommand.execute(message,args);
			} catch (error) {
				message.reply('there was an error trying to execute that command!');
			}
		}

		if (
			message.channel.type !== "GUILD_TEXT" ||
			message.channel.isThread() ||
		message.channel.name !== "forum" ||
	message.type != "DEFAULT" ||
message.author.bot
		) {
			return;
		}
		const row = new Discord.MessageActionRow().addComponents(
			new Discord.MessageSelectMenu().setCustomId("select").setPlaceholder(
				"Select one option",
			).addOptions(options),
		);

		message.reply({content: "What fits your issue best?", components: [row]});
	},
);

client.on(
	"interactionCreate",
	async (interaction) => {
		if (!interaction.isSelectMenu()) {
			return;
		}
		let thread = await ThreadInstance.new(interaction);
		thread.configure();
	}
);

// Handle auto archive I think
client.on(
	"threadUpdate",
	async (old,now) => {
		if (old.archived == false && now.archived == true) {
			if (registry.get(now) != undefined) registry.delete(now);
		}
	}
);

client.login(token);
