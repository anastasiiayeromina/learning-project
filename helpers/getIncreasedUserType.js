export const getIncreasedUserType = (userType) => {
  switch (userType) {
    case 'guest':
      return 'friend';
    case 'friend':
      return 'familyMember';
    case 'familyMember':
      return 'familyMember';
    default:
      return 'guest';
  }
}