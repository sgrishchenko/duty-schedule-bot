import { ContainerModule } from "inversify";
import { Types } from "./types";
import { RedisService } from "./services/RedisService";
import { DialogStateStorage } from "./storages/DialogStateStorage";
import { DutyScheduleDraftStorage } from "./storages/DutyScheduleDraftStorage";
import { DutyScheduleStorage } from "./storages/DutyScheduleStorage";
import { HelpMiddleware } from "./middlewares/HelpMiddleware";
import { NewScheduleMiddleware } from "./middlewares/NewScheduleMiddleware";
import { CurrentScheduleMiddleware } from "./middlewares/CurrentScheduleMiddleware";
import { DeleteScheduleMiddleware } from "./middlewares/DeleteScheduleMiddleware";
import { DialogStateMiddleware } from "./middlewares/DialogStateMiddleware";
import { DialogStateMembersMiddleware } from "./middlewares/DialogStateMembersMiddleware";
import { DialogStateIntervalMiddleware } from "./middlewares/DialogStateIntervalMiddleware";
import { DialogStateTeamSizeMiddleware } from "./middlewares/DialogStateTeamSizeMiddleware";
import { DialogStateTimeMiddleware } from "./middlewares/DialogStateTimeMiddleware";
import { SchedulerService } from "./services/SchedulerService";
import { IntervalView } from "./views/IntervalView";
import { DutyScheduleView } from "./views/DutyScheduleView";
import { NotificationView } from "./views/NotificationView";
import { createLogger, transports, format, Logger } from "winston";
import { extractServiceName } from "./utils/extractServiceName";
import chalk from "chalk";

export const logging = new ContainerModule((bind) => {
  const logger = createLogger({
    level: "info",
    format: format.combine(
      format.timestamp(),
      format.colorize(),
      format.printf((info) => {
        const { level, message } = info;
        const timestamp = chalk.green(info.timestamp);
        const service = chalk.cyan(`${info.service}`);
        const stack = info.stack ? `\n${info.stack}` : "";

        return `${timestamp} \t[${service}] \t${level}: \t${message}${stack}`;
      })
    ),
    transports: [new transports.Console()],
  });

  bind<Logger>(Types.Logger)
    .toDynamicValue((context) => {
      const serviceName = extractServiceName(context);

      return logger.child({ service: serviceName });
    })
    .inTransientScope();
});

export const storages = new ContainerModule((bind) => {
  bind<RedisService>(Types.RedisService).to(RedisService);

  bind<DialogStateStorage>(Types.DialogStateStorage).to(DialogStateStorage);
  bind<DutyScheduleDraftStorage>(Types.DutyScheduleDraftStorage).to(
    DutyScheduleDraftStorage
  );
  bind<DutyScheduleStorage>(Types.DutyScheduleStorage).to(DutyScheduleStorage);
});

export const views = new ContainerModule((bind) => {
  bind<IntervalView>(Types.IntervalView).to(IntervalView);
  bind<DutyScheduleView>(Types.DutyScheduleView).to(DutyScheduleView);
  bind<NotificationView>(Types.NotificationView).to(NotificationView);
});

export const middlewares = new ContainerModule((bind) => {
  bind<HelpMiddleware>(Types.HelpMiddleware).to(HelpMiddleware);

  bind<NewScheduleMiddleware>(Types.NewScheduleMiddleware).to(
    NewScheduleMiddleware
  );
  bind<CurrentScheduleMiddleware>(Types.CurrentScheduleMiddleware).to(
    CurrentScheduleMiddleware
  );
  bind<DeleteScheduleMiddleware>(Types.DeleteScheduleMiddleware).to(
    DeleteScheduleMiddleware
  );

  bind<DialogStateMiddleware>(Types.DialogStateMiddleware).to(
    DialogStateMiddleware
  );
  bind<DialogStateMembersMiddleware>(Types.DialogStateMembersMiddleware).to(
    DialogStateMembersMiddleware
  );
  bind<DialogStateIntervalMiddleware>(Types.DialogStateIntervalMiddleware).to(
    DialogStateIntervalMiddleware
  );
  bind<DialogStateTimeMiddleware>(Types.DialogStateTimeMiddleware).to(
    DialogStateTimeMiddleware
  );
  bind<DialogStateTeamSizeMiddleware>(Types.DialogStateTeamSizeMiddleware).to(
    DialogStateTeamSizeMiddleware
  );
});

export const scheduling = new ContainerModule((bind) => {
  bind<SchedulerService>(Types.SchedulerService).to(SchedulerService);
});
