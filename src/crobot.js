// @flow

import conf from './config';

import type {
  AuthData
} from './types';

const {
  RtmClient,
  CLIENT_EVENTS: {
    RTM: RTM_EVENTS
  },
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
		this.rtm.on(RTM_EVENTS.AUTHENTICATED, this.onAuthentication.bind(this));
		this.rtm.on(RTM_EVENTS.RTM_CONNECTION_OPENED, this.onOpenedConnection.bind(this));
	}

	onAuthentication(authData: AuthData): void {
		this.channel = (authData.channels.find(channel => (channel.is_member && channel.name ==='general')) || {}).id;
		this.name = authData.self.name;

		console.info(`Logged in as ${this.name} of team ${authData.team.name}, but not yet connected to a channel`);
	}

	onOpenedConnection(): void {
		this.rtm.sendMessage('Hello!', this.channel);
	}

	start() {
		this.rtm.start();
	}
}
