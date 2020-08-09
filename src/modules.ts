import colors from "colors/safe";
import { ContainerModule } from "inversify";
import { createLogger, format, Logger, transports } from "winston";
import { CurrentScheduleMiddleware } from "./middleware/CurrentScheduleMiddleware";
import { DeleteScheduleMiddleware } from "./middleware/DeleteScheduleMiddleware";
import { DialogStateIntervalMiddleware } from "./middleware/DialogStateIntervalMiddleware";
import { DialogStateMembersMiddleware } from "./middleware/DialogStateMembersMiddleware";
import { DialogStateMiddleware } from "./middleware/DialogStateMiddleware";
import { DialogStateTeamSizeMiddleware } from "./middleware/DialogStateTeamSizeMiddleware";
import { DialogStateTimeMiddleware } from "./middleware/DialogStateTimeMiddleware";
import { HelpMiddleware } from "./middleware/HelpMiddleware";
import { NewScheduleMiddleware } from "./middleware/NewScheduleMiddleware";
import { RedisService } from "./service/RedisService";
import { Scheduler } from "./service/Scheduler";
import { SchedulerFactory } from "./service/SchedulerFactory";
import { SchedulerService } from "./service/SchedulerService";
import { TeamService } from "./service/TeamService";
import { DialogStateStorage } from "./storage/DialogStateStorage";
import { DutyScheduleDraftStorage } from "./storage/DutyScheduleDraftStorage";
import { DutyScheduleStorage } from "./storage/DutyScheduleStorage";
import { Types } from "./types";
import { extractServiceName } from "./util/extractServiceName";
import { DutyScheduleView } from "./view/DutyScheduleView";
import { IntervalView } from "./view/IntervalView";
import { NotificationView } from "./view/NotificationView";

export const logging = new ContainerModule((bind) => {
  const logger = createLogger({
    level: "info",
    format: format.combine(
      format.timestamp(),
      format.colorize(),
      format.printf((info) => {
        const { level, message } = info;
        const timestamp = colors.green(info.timestamp);
        const service = colors.cyan(`${info.service}`);
        const stack = info.stack ? `\n${info.stack}` : "";
        const chat = info.chatId ? colors.blue(`chat: ${info.chatId} => `) : "";

        return `${timestamp} [${service}] ${level}: ${chat}${message}${stack}`;
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

export const storage = new ContainerModule((bind) => {
  bind<RedisService>(Types.RedisService).to(RedisService);

  bind<DialogStateStorage>(Types.DialogStateStorage).to(DialogStateStorage);
  bind<DutyScheduleDraftStorage>(Types.DutyScheduleDraftStorage).to(
    DutyScheduleDraftStorage
  );
  bind<DutyScheduleStorage>(Types.DutyScheduleStorage).to(DutyScheduleStorage);
});

export const view = new ContainerModule((bind) => {
  bind<IntervalView>(Types.IntervalView).to(IntervalView);
  bind<DutyScheduleView>(Types.DutyScheduleView).to(DutyScheduleView);
  bind<NotificationView>(Types.NotificationView).to(NotificationView);
});

export const middleware = new ContainerModule((bind) => {
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
  bind<TeamService>(Types.TeamService).to(TeamService);
  bind<SchedulerService>(Types.SchedulerService).to(SchedulerService);
  bind<SchedulerFactory>(Types.SchedulerFactory).toFactory<Scheduler>(
    (context): SchedulerFactory => {
      const teamService = context.container.get<TeamService>(Types.TeamService);
      return (...args) => new Scheduler(teamService, ...args);
    }
  );
});
