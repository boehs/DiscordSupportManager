"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadInstance = exports.registry = void 0;
const discord_js_1 = require("discord.js");
const config_example_1 = require("./config.example");
const util = require("util");
exports.registry = new discord_js_1.Collection();
class ThreadInstance {
    constructor(channel, interaction) {
        return (async () => {
            this.channel = channel;
            this.interaction = interaction;
            this.initialMessage = await this.interaction.message.fetchReference();
            this.author = this.initialMessage.author;
            this.closed = this.channel.archived;
            exports.registry.set(this.channel, this);
            return this;
        })();
    }
    static async new(interaction) {
        let channel = await interaction.channel.threads.create({
            name: `${interaction.user.username} - ${config_example_1.values[interaction.values[0]].name}`,
            autoArchiveDuration: 60,
        }).catch(console.error);
        return await new ThreadInstance(channel, interaction);
    }
    async configure() {
        await this.interaction.channel.bulkDelete(3);
        let newmessage = await this.channel.send(`${config_example_1.values[this.interaction.values[0]].name} request by ${this.author.username}:\n> ${this.initialMessage.content}`);
        await newmessage.pin();
        await this.channel.lastMessage.delete();
        await this.channel.send(util.format(config_example_1.values[this.interaction.values[0]].content, config_example_1.config.helper, this.interaction.user.id));
        await this.interaction.deferUpdate();
    }
    async archive(message) {
        if (message.author != this.author)
            return;
        this.channel.edit({ name: `💀 ${this.channel.name}`, archived: true, locked: true }, "User marked as closed");
        if (exports.registry.get(message.channel) != undefined)
            exports.registry.delete(message.channel);
    }
}
exports.ThreadInstance = ThreadInstance;
//# sourceMappingURL=ThreadManager.js.map