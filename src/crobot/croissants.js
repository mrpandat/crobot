// @flow

const croissantedUsers: {
  [key: string]: number,
} = {};

export function getUserCroissantsCount(user: string): number {
  return croissantedUsers[user] || 0;
}

export function increaseUserCroissantsCount(user: string): number {
  const croissantsCount = getUserCroissantsCount(user) + 1;
  croissantedUsers[user] = croissantsCount;

  return croissantsCount;
}

export function getCroissantedList(): string {
  if (croissantedUsers.length) {
    return 'No one has to bring breakfast :scream:';
  }

  const croissantedList = Object.keys(croissantedUsers).map(
    getUserNameAndCroissantsCount
  );

  return croissantedList.join('\n');
}

function getUserNameAndCroissantsCount(user: string): string {
  const croissantedUserCount: number = getUserCroissantsCount(user);
  return `- <@${user}>: ${croissantedUserCount} time(s)`;
}
