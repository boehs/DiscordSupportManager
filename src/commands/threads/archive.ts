import {ThreadInstance,registry} from '../../ThreadManager';
module.exports = {
	name: 'archive',
	aliases: ['close', 'done', 'end'],
	description: 'archive your help channel',
	async execute(message,args) {
		let chan = registry.get(message.channel);

		if (registry.get(message.channel) != undefined) await chan.archive(message);
	}
}
