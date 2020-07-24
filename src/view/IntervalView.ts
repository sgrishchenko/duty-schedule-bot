import { injectable } from "inversify";
import { Interval } from "../model/Interval";

@injectable()
export class IntervalView {
  public readonly intervalOptions = [
    {
      text: "Daily",
      value: Interval.Daily,
    },
    {
      text: "Every Workday",
      value: Interval.EveryWorkday,
    },
    {
      text: "Weekly",
      value: Interval.Weekly,
    },
  ];

  public render(interval: Interval) {
    const intervalOption = this.intervalOptions.find(
      (option) => option.value === interval
    );
    return intervalOption?.text ?? "";
  }

  public parse(input: string | undefined) {
    const text = (input ?? "").trim();

    const intervalOption = this.intervalOptions.find(
      (option) => option.text === text
    );

    return intervalOption?.value;
  }
}
