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
import { CancelMiddleware } from "./middlewares/CancelMiddleware";
import { NotificationView } from "./views/NotificationView";
import { PingService } from "./services/PingService";

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
  bind<CancelMiddleware>(Types.CancelMiddleware).to(CancelMiddleware);

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

export const monitoring = new ContainerModule((bind) => {
  bind<PingService>(Types.PingService).to(PingService);
});
