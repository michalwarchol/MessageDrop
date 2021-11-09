/**
 * @description Checks if given dates are different days
 * @param first {Date} Arg of type Date
 * @param second {Date} Arg of type Date
 */
export const isNewDay = (first: Date, second: Date) => {
  let firstDay = first.getDate();
  let secondDay = second.getDate();
  if (firstDay != secondDay) {
    return true;
  }

  let firstMonth = first.getMonth();
  let secondMonth = second.getMonth();
  if (firstMonth != secondMonth) {
    return true;
  }

  let firstYear = first.getFullYear();
  let secondYear = second.getFullYear();
  if (firstYear != secondYear) {
    return true;
  }

  return false;
};
