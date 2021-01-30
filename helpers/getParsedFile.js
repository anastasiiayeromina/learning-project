export const getParsedFile = (source) => {
  return source ? JSON.parse(source) : []; // handle logic with empty files
}