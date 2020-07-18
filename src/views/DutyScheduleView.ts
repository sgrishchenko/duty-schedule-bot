import { DutySchedule } from "../models/DutySchedule";
import { inject, injectable } from "inversify";
import { IntervalView } from "./IntervalView";
import { Types } from "../types";

@injectable()
export class DutyScheduleView {
  constructor(
    @inject(Types.IntervalView)
    private intervalView: IntervalView
  ) {}

  public render(schedule: DutySchedule) {
    const { members, pointer, teamSize, interval, time } = schedule;

    const internalView = this.intervalView.render(interval);
    const timeView = `${time.hours}:${String(time.minutes).padStart(2, "0")}`;

    return `
\u{1F465} *Current list of members*:
${members
  .map((member, index) => {
    const isDuty =
      pointer != -1 && index >= pointer && index < pointer + teamSize;

    return `    ${isDuty ? "\u{23F3}" : "\u{1F4A4}"} ${member}`;
  })
  .join("\n")}

\u23F0 *You will be notified*:
${internalView} at ${timeView}
    `;
  }
}
