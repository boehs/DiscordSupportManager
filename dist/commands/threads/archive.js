"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ThreadManager_1 = require("../../ThreadManager");
module.exports = {
    name: 'archive',
    aliases: ['close', 'done', 'end', 'solved'],
    description: 'archive your help channel',
    async execute(message, args) {
        let chan = ThreadManager_1.registry.get(message.channel);
        if (ThreadManager_1.registry.get(message.channel) != undefined)
            await chan.archive(message);
    }
};
//# sourceMappingURL=archive.js.map