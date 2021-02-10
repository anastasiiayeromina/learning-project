export const getItemById = (arr, id) => {
  const isCurrentItem = (element, index, array) => {
    return element.id === id;
  };
  const currentIndex = arr.findIndex(isCurrentItem);

  return arr[currentIndex];
}