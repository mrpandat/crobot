// @flow

export type AuthData = {
  channels: Channel[],
  users: User[],
  self: {
    name: string,
  },
  team: {
    name: string,
  },
};

export type Channel = {
  is_member: boolean,
  name: string,
  id: string,
};

export type User = {
  name: string,
  id: string,
};

export type Message = {
  type: string,
  channel: string,
  user: string,
  text: string,
  ts: string,
  source_team: string,
  team: string,
};
