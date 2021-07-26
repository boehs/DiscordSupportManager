import {config} from '../../config.example';
module.exports = {
	name: "checkin",
	description: "become a helper!",
	async execute(message,args) {
		if (!message.member.roles.cache.some(role => role.id === config.helper)) message.member.roles.add([config.helper]);
		else message.channel.send("silly goose, you can't do that!");
		message.delete();
	}
}
