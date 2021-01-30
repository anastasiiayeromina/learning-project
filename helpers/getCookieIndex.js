export const getCookieIndex = (data, userId) => {
  return data.findIndex((element, index, array) => {
    if (element && userId) {
      return userId === element.userId;
    }
  });
}