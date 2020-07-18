import moment, { now } from "moment";
import { DutySchedule } from "../models/DutySchedule";
import { Interval } from "../models/Interval";

export class Scheduler {
  private handleTimeout?: NodeJS.Timeout;
  private pointer: number;

  public constructor(
    private chatId: number,
    private dutySchedule: DutySchedule,
    private handleCallback: (team: string[], pointer: number) => void
  ) {
    this.pointer = dutySchedule.pointer;

    const { hours, minutes } = dutySchedule.time;

    const now = moment().utc();
    const start = moment().utc().hours(hours).minutes(minutes);

    if (start.isAfter(now)) {
      start.subtract(1, "day");
    }

    this.planNextHandling(start.valueOf());
  }

  private planNextHandling(timestamp = now()) {
    const now = moment();
    const next = moment(this.getNextIntervalTime(timestamp));
    const delayTime = next.diff(now);

    this.handleTimeout = setTimeout(() => {
      this.handleSchedule();

      this.planNextHandling();
    }, delayTime);
  }

  private getNextIntervalTime(timestamp: number) {
    const { interval } = this.dutySchedule;

    switch (interval) {
      case Interval.Daily: {
        return moment(timestamp).add(1, "day").valueOf();
      }
      case Interval.Weekly: {
        return moment(timestamp).add(1, "week").valueOf();
      }
      case Interval.EveryWorkday: {
        const date = moment(timestamp);

        do {
          date.add(1, "day");
        } while (Scheduler.isWeekend(date.valueOf()));

        return date.valueOf();
      }
    }
  }

  private static isWeekend(timestamp: number) {
    const date = moment(timestamp).utc();
    return date.isoWeekday() === 6 || date.isoWeekday() === 7;
  }

  private getMemberIndex(index: number) {
    const { members } = this.dutySchedule;

    return (members.length + index) % members.length;
  }

  private handleSchedule() {
    const { members, teamSize } = this.dutySchedule;
    const team = [];

    for (let i = 0; i < Math.min(teamSize, members.length); i++) {
      const memberIndex = this.getMemberIndex(this.pointer + i);
      team.push(members[memberIndex]);
    }

    this.pointer = this.getMemberIndex(this.pointer + 1);

    this.handleCallback(team, this.pointer);
  }

  public destroy() {
    if (this.handleTimeout) {
      clearInterval(this.handleTimeout);
    }
  }
}
