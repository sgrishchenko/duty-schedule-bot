import moment from "moment";
import { DutySchedule } from "../models/DutySchedule";
import { Interval } from "../models/Interval";

export class Scheduler {
  private readonly startTimeout: NodeJS.Timeout;
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

    let timeToStart = start.diff(now);

    if (timeToStart < 0) {
      start.add(1, "day");
      timeToStart = start.diff(now);
    }

    this.startTimeout = setTimeout(() => {
      this.planNextHandling();
    }, timeToStart);
  }

  private planNextHandling() {
    this.handleSchedule();

    this.handleTimeout = setTimeout(() => {
      this.planNextHandling();
    }, this.getIntervalMilliseconds());
  }

  private getIntervalMilliseconds() {
    const { interval } = this.dutySchedule;

    switch (interval) {
      case Interval.Daily: {
        return moment.duration(1, "day").asMilliseconds();
      }
      case Interval.Weekly: {
        return moment.duration(1, "week").asMilliseconds();
      }
      case Interval.EveryWorkday: {
        const duration = moment.duration(0);
        const nextDay = moment().utc();

        do {
          nextDay.add(1, "day");
          duration.add(1, "day");

          // while next day is Sunday of Saturday
        } while (nextDay.isoWeekday() === 6 || nextDay.isoWeekday() === 7);

        return duration.asMilliseconds();
      }
    }
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
    clearTimeout(this.startTimeout);

    if (this.handleTimeout) {
      clearInterval(this.handleTimeout);
    }
  }
}
