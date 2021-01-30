export const getUniqueId = () => {
  const ID_LENGTH = 7;
  let text = ``;
  const possible =
      `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;

  for (let i = 0; i < ID_LENGTH; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}