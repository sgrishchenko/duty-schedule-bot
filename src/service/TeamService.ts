import { injectable } from "inversify";
import { DutySchedule } from "../model/DutySchedule";

@injectable()
export class TeamService {
  public getMemberIndex(schedule: DutySchedule, index: number) {
    const { members } = schedule;

    return (members.length + index) % members.length;
  }

  public getTeam(schedule: DutySchedule, pointer: number) {
    if (pointer === -1) return [];

    const { members, teamSize } = schedule;
    const team = [];

    for (let i = 0; i < Math.min(teamSize, members.length); i++) {
      const memberIndex = this.getMemberIndex(schedule, pointer + i);
      team.push(members[memberIndex]);
    }

    return team;
  }
}
