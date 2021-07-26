"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const ThreadManager_1 = require("./ThreadManager");
const config_example_1 = require("./config.example");
const fs_1 = __importDefault(require("fs"));
const shhh_json_1 = require("./shhh.json");
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});
client.commands = new Discord.Collection();
const commandFolders = fs_1.default.readdirSync('./commands');
for (const folder of commandFolders) {
    const commandFiles = fs_1.default.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}
client.once("ready", async () => {
    console.log("Ready!");
    client.user.setActivity("for messages in #forum", { type: "WATCHING" });
    let msgChan = await client.channels.fetch(config_example_1.config.hostChannel);
    setInterval(async function () {
        let msgs = await msgChan.messages.fetch();
        for (const msg of msgs.array()) {
            if (msg.id == config_example_1.config.hostMsg) {
                continue;
            }
            if (Date.now() - msg.createdAt < 30000) {
                continue;
            }
            await msg.delete();
        }
    }, 10000);
});
client.on("message", (message) => {
    if (message.content.startsWith(config_example_1.config.prefix)) {
        const args = message.content.slice(config_example_1.config.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        try {
            let maycommand = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
            maycommand.execute(message, args);
        }
        catch (error) {
            message.reply('there was an error trying to execute that command!');
        }
    }
    if (message.channel.type !== "GUILD_TEXT" ||
        message.channel.isThread() ||
        message.channel.name !== "forum" ||
        message.type != "DEFAULT" ||
        message.author.bot) {
        return;
    }
    const row = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu().setCustomId("select").setPlaceholder("Select one option").addOptions(config_example_1.options));
    message.reply({ content: "What fits your issue best?", components: [row] });
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isSelectMenu()) {
        return;
    }
    let thread = await ThreadManager_1.ThreadInstance.new(interaction);
    thread.configure();
});
// Handle auto archive I think
client.on("threadUpdate", async (old, now) => {
    if (old.archived == false && now.archived == true) {
        if (ThreadManager_1.registry.get(now) != undefined)
            ThreadManager_1.registry.delete(now);
    }
});
client.login(shhh_json_1.token);
//# sourceMappingURL=index.js.map