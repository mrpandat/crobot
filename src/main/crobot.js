// @flow

import type { AuthData, Channel, Message } from './types';

const {
  RtmClient,
  CLIENT_EVENTS: { RTM: RTM_CLIENT_EVENTS },
  RTM_EVENTS,
} = require('@slack/client');

export class Crobot {
  rtm: RtmClient;
  channel: ?Channel;
  name: string;
  channelToConnecTo: string;

  constructor() {
    this.channelToConnecTo = throwIfNull('CHANNEL_TO_CONNECT_TO');
    const botToken = throwIfNull('BOT_TOKEN');

    this.rtm = new RtmClient(botToken, {
      logLevel: 'error',
    });

    this.initListeners();
  }

  initListeners(): void {
    this.rtm.on(
      RTM_CLIENT_EVENTS.AUTHENTICATED,
      this.onAuthentication.bind(this)
    );
    this.rtm.on(
      RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED,
      this.onConnectionOpened.bind(this)
    );
    this.rtm.on(RTM_EVENTS.MESSAGE, this.onMessageReceived.bind(this));

    process.on('exit', this.disconnect.bind(this));
    process.on('SIGINT', this.disconnect.bind(this));
    process.on('uncaughtException', this.disconnect.bind(this));
  }

  onAuthentication(authData: AuthData): void {
    this.channel = authData.channels.find(
      channel => channel.is_member && channel.name === this.channelToConnecTo
    );

    this.name = authData.self.name;

    console.info(
      `Logged in as ${this.name} of team ${authData.team
        .name}, but not yet connected to a channel`
    );
  }

  onConnectionOpened(): void {
    if (this.channel) {
      console.info(`Connected to #${this.channel.name} as ${this.name}`);
    }
  }

  onMessageReceived(message: Message): void {
    console.info(`New message received ${message.text}`);
  }

  start() {
    this.rtm.start();
  }

  disconnect() {
    this.rtm.disconnect();
    console.info('Bot disconnected');
  }
}

function throwIfNull(key: string): string {
  if (process.env[key] === undefined || process.env[key] === null) {
    throw new Error(`${key} required`);
  }

  return process.env[key];
}
