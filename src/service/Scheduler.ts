import moment, { now } from 'moment';
import { DutySchedule } from '../model/DutySchedule';
import { Interval } from '../model/Interval';

export class Scheduler {
  private handleTimeout?: NodeJS.Timeout;

  public constructor(private dutySchedule: DutySchedule, private handleCallback: () => void) {
    const { hours, minutes } = dutySchedule.time;

    const now = moment().utc();
    const start = moment().utc().hours(hours).minutes(minutes).seconds(0);

    if (start.isAfter(now)) {
      start.subtract(1, 'day');
    }

    this.planNextHandling(start.valueOf());
  }

  private planNextHandling(timestamp = now()) {
    const now = moment();
    const next = moment(this.getNextIntervalTime(timestamp));
    const delayTime = next.diff(now);

    this.handleTimeout = setTimeout(() => {
      this.handleCallback();

      this.planNextHandling();
    }, delayTime);
  }

  private getNextIntervalTime(timestamp: number) {
    const { interval } = this.dutySchedule;

    switch (interval) {
      case Interval.Daily: {
        return moment(timestamp).add(1, 'day').valueOf();
      }
      case Interval.Weekly: {
        return moment(timestamp).add(1, 'week').valueOf();
      }
      case Interval.EveryWorkday: {
        const date = moment(timestamp);

        do {
          date.add(1, 'day');
        } while (Scheduler.isWeekend(date.valueOf()));

        return date.valueOf();
      }
    }
  }

  private static isWeekend(timestamp: number) {
    const date = moment(timestamp).utc();
    return date.isoWeekday() === 6 || date.isoWeekday() === 7;
  }

  public destroy() {
    if (this.handleTimeout) {
      clearInterval(this.handleTimeout);
    }
  }
}
