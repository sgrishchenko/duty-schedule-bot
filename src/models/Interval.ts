export enum Interval {
  Daily = "Daily",
  EveryWorkday = "EveryWorkday",
  Weekly = "Weekly",
}

export const intervalOptions = [
  {
    text: "Daily",
    callback_data: Interval.Daily,
  },
  {
    text: "Every Workday",
    callback_data: Interval.EveryWorkday,
  },
  {
    text: "Weekly",
    callback_data: Interval.Weekly,
  },
];
