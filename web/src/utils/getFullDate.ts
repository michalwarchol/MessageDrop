const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * @description Function formats a Date to return month, day and year
 * @param date The date, of which value is returned
 * @returns string
 */
export const getFullDate = (date: Date) => {
    return monthNames[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear();
}