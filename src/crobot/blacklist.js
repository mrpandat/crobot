// @flow

const blackListedUsers: string[] = [];

export function isBlackListed(user: string): boolean {
  return blackListedUsers.includes(user);
}

export function blackListUser(user: string, croissantsCount: number): string {
  const messages = [];

  if (blackListedUsers.includes(user)) {
    messages.push(`Hey <@${user}>, you're already blacklisted!`);
  } else {
    messages.push(
      `<@${user}> you've successfully been blacklisted! You can't eat breakfast brought by your colleagues anymore. I feel sad for you :sob:`
    );
    blackListedUsers.push(user);
  }

  if (croissantsCount) {
    messages.push(
      `Just remember that it's not because you're blacklisted that you don't have to pay your debts. You still have to bring breakfast ${croissantsCount} time(s)`
    );
  }

  return messages.join('\n');
}
