export const getMessageByUserType = (userType) => {
  switch (userType) {
    case 'guest':
      return 'Приветствуем тебя, странник!';
    case 'friend':
      return 'Приветствуем тебя, друг!';
    case 'familyMember':
      return 'Добро пожаловать в семье!';
    default:
      return 'Hello, world!';
  }
};