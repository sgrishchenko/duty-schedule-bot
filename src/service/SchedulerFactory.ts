import { Scheduler } from "./Scheduler";

export type SchedulerFactory = (
  ...args: ConstructorParameters<typeof Scheduler>
) => Scheduler;
