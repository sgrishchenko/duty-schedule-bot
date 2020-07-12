import {dutyScheduleStorage} from "../storages/DutyScheduleStorage";
import {Scheduler} from "./Scheduler";
import {bot} from "../bot";

export class SchedulerService {
    public async init() {
        const dutySchedules = await dutyScheduleStorage.getAll();

        for (const entry of Object.entries(dutySchedules)) {
            const [key, dutySchedule] = entry;
            const chatId = Number(key);

            new Scheduler(chatId, dutySchedule, pointer => {
                const {members, teamSize} = dutySchedule;
                const team = [];

                for (let i = 0; i < Math.min(teamSize, members.length); i++) {
                    const memberIndex = (members.length + pointer + i) % members.length;
                    team.push(members[memberIndex])
                }

                bot.telegram.sendMessage(chatId, 'Now on duty:\n' + team.join('\n'))
            })
        }
    }
}

export const schedulerService = new SchedulerService()
