// @flow

import {
  RtmClient,
  CLIENT_EVENTS,
  RTM_EVENTS,
  MemoryDataStore,
} from '@slack/client';

import {
  increaseUserCroissantsCount,
  decreaseUserCroissantsCount,
  getUserCroissantsCount,
  getCroissantedList,
  voteForUncroissantedUser,
} from './croissants';
import { blackListUser, isBlackListed } from './blacklist';

import {
  extractTaggedUsersFromText,
  throwIfNull,
  usernameToUserid,
} from './utils';

import type { AuthData, Channel, Message, User } from './types';

const { RTM: RTM_CLIENT_EVENTS } = CLIENT_EVENTS;

export class Crobot {
  rtm: RtmClient;
  channel: ?Channel;
  users: User[];
  name: string;
  isConnected: boolean;

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
    process.on('uncaughtException', err => {
      console.info('ERROR: ', err);
      return this.disconnect.bind(this);
    });
  }

  onAuthentication(authData: AuthData): void {
    this.users = authData.users;
    this.channel = authData.channels.find(
      channel => channel.is_member && channel.name === 'crobot_test'
    );

    this.name = authData.self.name;

    console.info(
      `Logged in as ${this.name} of team ${
        authData.team.name
      }, but not yet connected to a channel`
    );
  }

  onConnectionOpened(): void {
    if (this.channel) {
      console.info(`Connected to #${this.channel.name} as ${this.name}`);
      this.isConnected = true;
    }
  }

  onMessageReceived(message: Message): void {
    const { text } = message;
    const taggedUsernames: string[] = extractTaggedUsersFromText(text).map(
      taggedUser => this.rtm.dataStore.getUserById(taggedUser).name
    );

    if (taggedUsernames.includes(this.name)) {
      let responseMessage;
      let sendUser = message.user;
      if (text.match(/croissant/g)) {
        responseMessage = this.onCroissantedUser(sendUser);
      } else if (text.match(/blacklist me/g)) {
        responseMessage = this.onBlacklistedUser(sendUser);
      } else if (text.match(/list/g)) {
        responseMessage = getCroissantedList();
      } else if (text.match(/paid/g)) {
        responseMessage = this.onUncroissantedUser(sendUser);
      } else if (text.match(/a payé/g)) {
        responseMessage = this.onVoteForUncroissantedUser(
          sendUser,
          taggedUsernames
        );
      } else {
        responseMessage = `<@${
          message.user
        }> I did not understand your message, sorry !`;
      }

      if (responseMessage) {
        this.sendMessage(responseMessage);
      }
    }
  }

  onCroissantedUser(user: string): string {
    if (isBlackListed(user)) {
      return `<@${user}> is blacklisted and can't be croissanted. You mad bro? :stuck_out_tongue:`;
    }

    const newCroissantsCount = increaseUserCroissantsCount(user);

    return `<@${user}> now needs to bring breakfast ${newCroissantsCount} time(s)! :sunglasses:`;
  }

  onUncroissantedUser(user: string): string {
    const newCroissantsCount = decreaseUserCroissantsCount(user);

    return `<@${user}> paid his/her croissants and now needs to bring breakfast ${newCroissantsCount} time(s)! :sunglasses:`;
  }

  onVoteForUncroissantedUser(user: string, taggedUsernames: [string]): string {
    if (taggedUsernames[1]) {
      return voteForUncroissantedUser(
        usernameToUserid(taggedUsernames[1], this.users),
        user
      );
    } else {
      return `<@${user}> You need to specify who paid his/her breakfast :o`;
    }
  }

  onBlacklistedUser(user: string): string {
    const croissantsCount = getUserCroissantsCount(user);
    return blackListUser(user, croissantsCount);
  }

  sendMessage(message: string): void {
    if (this.channel && this.channel.id) {
      this.rtm.sendMessage(message, this.channel.id);
    }
  }

  start(): void {
    this.rtm.start();
  }

  disconnect(): void {
    if (this.isConnected) {
      this.rtm.disconnect();
      console.info('Bot disconnected');
      this.isConnected = false;
    }
  }
}
