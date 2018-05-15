// @flow

const croissantedUsers: {
  [key: string]: {
    debt: number,
    vote: string[],
  },
} = {};

export function getUserCroissantsCount(user: string): number {
  return croissantedUsers[user] ? croissantedUsers[user].debt : 0;
}

export function getUserVoteCount(croissantedUser: string): number {
  return croissantedUsers[croissantedUser] &&
    croissantedUsers[croissantedUser].vote
    ? croissantedUsers[croissantedUser].vote.length
    : 0;
}

export function increaseVoteList(croissantedUser: string, votingUser: string) {
  croissantedUsers[croissantedUser].vote.push(votingUser);
}

export function resetVoteList(croissantedUser: string) {
  croissantedUsers[croissantedUser].vote = [];
}

export function hasUserVoted(user: string, votingUser: string) {
  return (
    croissantedUsers[user] &&
    croissantedUsers[user].vote &&
    croissantedUsers[user].vote.indexOf(votingUser) >= 0
  );
}

export function increaseUserCroissantsCount(user: string): number {
  const croissantsCount = getUserCroissantsCount(user) + 1;
  croissantedUsers[user] = {
    debt: croissantsCount,
    vote: [],
  };
  return croissantsCount;
}

export function decreaseUserCroissantsCount(user: string): number {
  const croissantsCount = getUserCroissantsCount(user) - 1;
  if (croissantsCount >= 0) {
    croissantedUsers[user] = {
      debt: croissantsCount,
      vote: [],
    };
    return croissantsCount;
  }
  return 0;
}

export function voteForUncroissantedUser(
  croissantedUser: ?string,
  votingUser: string
): string {
  if (!croissantedUser) {
    return `Error`;
  }

  if (croissantedUser == votingUser) {
    const newCroissantsCount = increaseUserCroissantsCount(croissantedUser);
    return `<@${croissantedUser}> You are a real cheater are'nt you ? One more breakfast to bring, you now have a debt of ${newCroissantsCount} croissants ! :croissant:`;
  }

  if (getUserCroissantsCount(croissantedUser) === 0) {
    return `<@${croissantedUser}> Currently has no debt !`;
  }

  let nbVotes = getUserVoteCount(croissantedUser);
  if (nbVotes < 2) {
    if (!hasUserVoted(croissantedUser, votingUser)) {
      increaseVoteList(croissantedUser, votingUser);
      nbVotes++;
    } else {
      return `<@${votingUser}> You can't vote two times, cheater !`;
    }
  }

  if (nbVotes === 2) {
    const newCroissantsCount = decreaseUserCroissantsCount(croissantedUser);
    if (newCroissantsCount === 0) {
      return `<@${croissantedUser}> paid his/her croissants and now does not have a debt anymore :sunglasses:`;
    } else {
      return `<@${croissantedUser}> paid his/her croissants and now needs to bring breakfast ${newCroissantsCount} time(s)! :sunglasses:`;
    }
  }

  return `<@${votingUser}> Your vote has been take in count`;
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
