import { inject, injectable } from 'inversify';
import { DutySchedule } from '../model/DutySchedule';
import { TeamService } from '../service/TeamService';
import { Types } from '../types';
import { IntervalView } from './IntervalView';

@injectable()
export class DutyScheduleView {
  constructor(
    @inject(Types.TeamService)
    private teamService: TeamService,
    @inject(Types.IntervalView)
    private intervalView: IntervalView,
  ) {}

  public render(schedule: DutySchedule) {
    const { interval, time } = schedule;

    const internalView = this.intervalView.render(interval);
    const timeView = `${time.hours}:${String(time.minutes).padStart(2, '0')}`;

    return `
👥 *Current list of members*:
${this.renderMembers(schedule)}

⏰ *You will be notified*:
${internalView} at ${timeView}
    `;
  }

  private renderMembers(schedule: DutySchedule) {
    const { members } = schedule;
    const team = this.teamService.getTeam(schedule);

    return members
      .map((member) => {
        const isDuty = team.includes(member);
        return `    ${isDuty ? '⏳' : '💤'} ${member}`;
      })
      .join('\n');
  }
}
