export const getCookieIndex = (data, userId) => {
  return data.findIndex((element, index, array) => {
    if (element && userId) {
      return userId === element.userId;
    }
  });
}

export const getSlugIndex = (data, slug) => {
  return data.findIndex((element, index, array) => {
    if (element && slug) {
      return slug === element.id;
    }
  });
}