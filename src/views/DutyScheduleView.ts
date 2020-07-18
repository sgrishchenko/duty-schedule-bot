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

    return `
:busts_in_silhouette: **Current list of members**:
${members.map((member, index) => {
  const isDuty = index >= pointer && index < pointer + teamSize;

  return `* ${member} ${isDuty ? ":white_check_mark:" : ""}  \n`;
})}

_The :white_check_mark: sign marks those who were on duty the last time._

:alarm_clock: **You will be notified**:
${this.intervalView.render(interval)} at ${time.hours}:${time.minutes}
  `;
  }
}
