import { extend } from '../helpers/extend'

export const addUser = (data, userId) => {
  const newUser = { userId: userId, visitCounts: 1 };
  data.push(newUser);
}

export const updateUser = (data, cookieIndex) => {
  const updatedUser = extend(data[cookieIndex], {
    visitCounts: data[cookieIndex].visitCounts + 1
  });
  data[cookieIndex] = updatedUser;
}