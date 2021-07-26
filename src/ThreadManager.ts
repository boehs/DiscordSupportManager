import {Collection, GuildMember, Interaction, Message, SelectMenuInteraction, ThreadChannel} from "discord.js";
import {values,config} from "./config.example";
const util = require("util");

export const registry = new Collection();

export interface ThreadInstanceI {
	channel: ThreadChannel,
	author: GuildMember,
	interaction: SelectMenuInteraction,
	initialMessage: Message,
	closed: Boolean,
	claimer: GuildMember
}

export class ThreadInstance implements ThreadInstanceI {
	constructor(
		channel: ThreadChannel,
		interaction: SelectMenuInteraction,
	) {
		return (async () => {
			this.channel = channel;
			this.interaction = interaction;
			this.initialMessage = await this.interaction.message.fetchReference();
			this.author = this.initialMessage.author;
			this.closed = this.channel.archived;
			
			registry.set(this.channel, this);
			return this;
		})();
	}

	static async new(interaction: Interaction) {

		let channel = await interaction.channel.threads.create({
			name: `${interaction.user.username} - ${values[interaction.values[0]].name}`,
			autoArchiveDuration: 60,
		}).catch(console.error);

		return await new ThreadInstance(channel,interaction);
	}

	async configure() {
		await this.interaction.channel.bulkDelete(3);
		let newmessage = await this.channel.send(
			`${values[this.interaction.values[0]].name} request by ${this.author.username}:\n> ${this.initialMessage.content}`,
		);
		await newmessage.pin();
		await this.channel.lastMessage.delete();

		await this.channel.send(
			util.format(
				values[this.interaction.values[0]].content,
				config.helper,
				this.interaction.user.id,
			),
		);

		await this.interaction.deferUpdate();
	}

	async archive(message: Message) {
		if (message.author != this.author) return;

		this.channel.edit({name: `💀 ${this.channel.name}`, archived: true, locked: true}, "User marked as closed");

		if (registry.get(message.channel) != undefined) registry.delete(message.channel);
	}
}
