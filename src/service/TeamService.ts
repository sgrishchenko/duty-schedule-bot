import { injectable } from "inversify";
import { DutySchedule } from "../model/DutySchedule";

@injectable()
export class TeamService {
  private static getMemberIndex(schedule: DutySchedule, index: number) {
    const { members } = schedule;

    return (members.length + index) % members.length;
  }

  public movePointer(schedule: DutySchedule) {
    let { pointer } = schedule;

    pointer = TeamService.getMemberIndex(schedule, pointer + 1);

    return {
      ...schedule,
      pointer,
    };
  }

  public getTeam(schedule: DutySchedule) {
    const { pointer, members, teamSize } = schedule;

    if (pointer === -1) return [];

    const team = [];

    for (let i = 0; i < Math.min(teamSize, members.length); i++) {
      const memberIndex = TeamService.getMemberIndex(schedule, pointer + i);
      team.push(members[memberIndex]);
    }

    return team;
  }
}
