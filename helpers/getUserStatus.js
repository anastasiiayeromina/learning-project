import { getCookieIndex } from '../helpers/getCookieIndex'

export const getUserStatus = (userData, userId) => {
  const userCookieIndex = getCookieIndex(userData, userId);
  const userVisitsCount = userData[userCookieIndex].visitCounts;

  return {
    isGuest: userVisitsCount < 3,
    isFriend: userVisitsCount >= 3 && userVisitsCount < 5,
    isFamilyMember: userVisitsCount >= 5
  }
}