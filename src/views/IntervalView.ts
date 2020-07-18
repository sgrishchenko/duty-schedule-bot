import { Interval } from "../models/Interval";

export class IntervalView {
  public readonly intervalOptions = [
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

  public render(interval: Interval) {
    const intervalOption = this.intervalOptions.find(
      (option) => option.callback_data === interval
    );
    return intervalOption?.text ?? "";
  }
}
