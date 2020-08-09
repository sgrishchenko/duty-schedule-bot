import { DutySchedule } from "../model/DutySchedule";
import { Scheduler } from "./Scheduler";

export type SchedulerFactory = (
  chatId: number,
  dutySchedule: DutySchedule,
  handleCallback: (team: string[], pointer: number) => void
) => Scheduler;
