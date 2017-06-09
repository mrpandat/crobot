// @flow

import type {
  AuthData,
	Message,
} from './types';

const {
  RtmClient,
  CLIENT_EVENTS: {
    RTM: RTM_CLIENT_EVENTS
  },
  RTM_EVENTS
} = require('@slack/client');

export class Crobot {
	rtm: RtmClient;
	channel: string;
	name: string;

	constructor() {
		this.rtm = new RtmClient(process.env.SLACK_BOT_TOKEN);

		this.initListeners();
	}

	initListeners(): void {
		this.rtm.on(RTM_CLIENT_EVENTS.AUTHENTICATED, this.onAuthentication.bind(this));
		this.rtm.on(RTM_EVENTS.MESSAGE, this.onMessageReceived.bind(this));
	}

	onAuthentication(authData: AuthData): void {
		this.channel = (authData.channels.find(channel => (channel.is_member && channel.name ==='general')) || {}).id;
		this.name = authData.self.name;

		console.info(`Logged in as ${this.name} of team ${authData.team.name}, but not yet connected to a channel`);
	}

	onMessageReceived(message: Message): void {
		console.info(`New message received ${message.text}`);
	}

	start() {
		this.rtm.start();
	}
}
