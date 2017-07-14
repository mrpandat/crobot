// @flow

import type { AuthData, Channel, Message } from './types';

import {
  RtmClient,
  CLIENT_EVENTS,
  RTM_EVENTS,
  MemoryDataStore,
} from '@slack/client';

const { RTM: RTM_CLIENT_EVENTS } = CLIENT_EVENTS;

const taggedUserRegExp: RegExp = new RegExp(/\<@(U[A-Z0-9]{8})\>/g);

export class Crobot {
  rtm: RtmClient;
  channel: ?Channel;
  name: string;

  croissantedUsers: {
    [key: string]: number,
  } = {};

  constructor() {
    const botToken = throwIfNull('BOT_TOKEN');

    this.rtm = new RtmClient(botToken, {
      logLevel: 'error',
      dataStore: new MemoryDataStore(),
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
      channel => channel.is_member && channel.name === 'general'
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
    const { text } = message;
    const taggedUsernames = this.extractTaggedUsernamesFromText(text);

    if (taggedUsernames.includes(this.name)) {
      this.croissantedUsers[message.user] = this.croissantedUsers[message.user]
        ? this.croissantedUsers[message.user] + 1
        : 1;
      console.info(JSON.stringify(this.croissantedUsers));
    }
  }

  start(): void {
    this.rtm.start();
  }

  disconnect(): void {
    this.rtm.disconnect();
    console.info('Bot disconnected');
  }

  extractTaggedUsernamesFromText(text: string): string[] {
    const taggedUsers = [];

    let match: string = taggedUserRegExp.exec(text);
    while (match !== null) {
      taggedUsers.push(match[1]);
      match = taggedUserRegExp.exec(text);
    }

    return taggedUsers.map(
      taggedUser => this.rtm.dataStore.getUserById(taggedUser).name
    );
  }
}

function throwIfNull(key: string): string {
  if (process.env[key] === undefined || process.env[key] === null) {
    throw new Error(`${key} required`);
  }

  return process.env[key];
}
