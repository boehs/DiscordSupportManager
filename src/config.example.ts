export const config = {
	hostChannel: "866561568266780672",
	hostMsg: "869018608964075521",
	helper: "866521285248548905",
	prefix: '&'
};

const GENERIC = "(cc: <@&%s>) <@%s>, someone will be along shortly to help. In the meantime, be sure to continue to add information, such as \n-  What you tried \n-  Screenshots \n-  A detailed explanation \n if you have not already";

export const values = {
	steam_help: {
		content: GENERIC,
		name: "Steam",
	},
	game_help: {
		content: GENERIC,
		name: "Game",
	},
	hw_help: {
		content: GENERIC,
		name: "Hardware",
	},
	acc_help: {
		content: "(cc: <@&%s>) <@%s>, follow the instructions at <https://rste.am/hijacked> or <https://steamcommunity.com/sharedfiles/filedetails/?id=1126288560> to recover your account. Read the entire guide before asking questions, and follow the guide even if your email address and password have been changed. This is the only way to recover your account. If you have already submitted a ticket to Steam, wait for a response from Support before continuing.",
		name: "Hacked",
	},
	other_help: {
		content: GENERIC,
		name: "Other",
	},
};

export const options = [
	{
		label: "Steam",
		description: "Help with steam client, purchases, and website",
		value: "steam_help",
	},
	{
		label: "Game",
		description: "Game performance, crashing, other troubleshooting",
		value: "game_help",
	},
	{
		label: "Hardware",
		description: "Help with link, index, deck, other steam hardware",
		value: "hw_help",
	},
	{
		label: "Account recovery",
		description: "Recover account after forgetting info/being hacked",
		value: "acc_help",
	},
	{
		label: "Other",
		description: "Something not mentioned here",
		value: "other_help",
	},
];
