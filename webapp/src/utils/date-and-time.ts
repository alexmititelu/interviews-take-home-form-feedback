import moment from "moment";

export const getDateFullFormat = (date: Date | string | number) => {
  return moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
};

export const getDateRelative = (date: Date | string | number) => {
  return moment(date).fromNow();
};
