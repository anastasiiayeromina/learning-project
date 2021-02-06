import { getCookieIndex } from '../helpers/getCookieIndex'

export const getUserStatus = (userData, userId) => {
  const userCookieIndex = getCookieIndex(userData, userId);
  const visitCounts = userData[userCookieIndex].visitCounts;

  let userType = '';
  if (visitCounts < 3) {
    userType = 'guest';
  }
  else if (visitCounts >= 3 && visitCounts < 5) {
    userType = 'friend';
  } else if (visitCounts >= 5) {
    userType = 'familyMember';
  }

  return {
    userType,
    visitCounts,
  }
}