export const dateString: (transDate: Date) => string = (transDate) => {
  const year = transDate.getFullYear();
  const month = transDate.getMonth() + 1;
  const date = transDate.getDate();

  return `${year}-${month}-${date}`;
};
