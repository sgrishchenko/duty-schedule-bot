import moment, { now } from "moment";
import { DutySchedule } from "../model/DutySchedule";
import { Interval } from "../model/Interval";
import { TeamService } from "./TeamService";

export class Scheduler {
  private handleTimeout?: NodeJS.Timeout;
  private pointer: number;

  public constructor(
    private teamService: TeamService,

    private chatId: number,
    private dutySchedule: DutySchedule,
    private handleCallback: (team: string[], pointer: number) => void
  ) {
    this.pointer = dutySchedule.pointer;

    const { hours, minutes } = dutySchedule.time;

    const now = moment().utc();
    const start = moment().utc().hours(hours).minutes(minutes).seconds(0);

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

  private handleSchedule() {
    this.pointer = this.teamService.getMemberIndex(
      this.dutySchedule,
      this.pointer + 1
    );

    const team = this.teamService.getTeam(this.dutySchedule, this.pointer);

    this.handleCallback(team, this.pointer);
  }

  public destroy() {
    if (this.handleTimeout) {
      clearInterval(this.handleTimeout);
    }
  }
}
