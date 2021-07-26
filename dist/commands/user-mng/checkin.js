"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_example_1 = require("../../config.example");
module.exports = {
    name: "checkin",
    description: "become a helper!",
    async execute(message, args) {
        if (!message.member.roles.cache.some(role => role.id === config_example_1.config.helper))
            message.member.roles.add([config_example_1.config.helper]);
        else
            message.channel.send("silly goose, you can't do that!");
        message.delete();
    }
};
//# sourceMappingURL=checkin.js.map