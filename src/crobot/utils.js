// @flow

const taggedUserRegExp: RegExp = new RegExp(/<@(U[A-Z0-9]{8})>/g);

export function extractTaggedUsersFromText(text: string): string[] {
  const taggedUsers = [];

  let match: string = taggedUserRegExp.exec(text);
  while (match !== null) {
    taggedUsers.push(match[1]);
    match = taggedUserRegExp.exec(text);
  }

  return taggedUsers;
}

export function throwIfNull(key: string): string {
  if (process.env[key] === undefined || process.env[key] === null) {
    throw new Error(`${key} required`);
  }

  return process.env[key];
}

export function userIdToUsername(id: string, users: any): ?string {
  for (var uid in users) {
    if (users[uid].id === id) {
      return users[uid].name;
    }
  }
}

export function usernameToUserid(username: string, users: any): ?string {
  for (var uid in users) {
    if (users[uid].name === username) {
      return users[uid].id;
    }
  }
}
