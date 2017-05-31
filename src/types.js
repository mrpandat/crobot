// @flow

export type AuthData = {
  channels: Channel[],
  self: {
    name: string;
  };
  team: {
    name: string;
  }
}

export type Channel = {
    is_member: boolean;
    name: string;
    id: string;
}
