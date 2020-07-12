import { Container } from "inversify";
import { Types } from "./types";
import {RedisService} from "./services/RedisService";
import {DialogStateStorage} from "./storages/DialogStateStorage";
import {DutyScheduleDraftStorage} from "./storages/DutyScheduleDraftStorage";
import {DutyScheduleStorage} from "./storages/DutyScheduleStorage";
import {HelpMiddleware} from "./middlewares/HelpMiddleware";
import {NewScheduleMiddleware} from "./middlewares/NewScheduleMiddleware";
import {CurrentScheduleMiddleware} from "./middlewares/CurrentScheduleMiddleware";
import {DeleteScheduleMiddleware} from "./middlewares/DeleteScheduleMiddleware";
import {DialogStateMiddleware} from "./middlewares/DialogStateMiddleware";
import {DialogStateMembersMiddleware} from "./middlewares/DialogStateMembersMiddleware";
import {DialogStateIntervalMiddleware} from "./middlewares/DialogStateIntervalMiddleware";
import {DialogStateTeamSizeMiddleware} from "./middlewares/DialogStateTeamSizeMiddleware";
import {DialogStateTimeMiddleware} from "./middlewares/DialogStateTimeMiddleware";
import {SchedulerService} from "./services/SchedulerService";
import {TelegrafBot} from "./TelegrafBot";

export const container = new Container({
    defaultScope: "Singleton",
});

container.bind<RedisService>(Types.RedisService).to(RedisService);

container.bind<DialogStateStorage>(Types.DialogStateStorage).to(DialogStateStorage);
container.bind<DutyScheduleDraftStorage>(Types.DutyScheduleDraftStorage).to(DutyScheduleDraftStorage);
container.bind<DutyScheduleStorage>(Types.DutyScheduleStorage).to(DutyScheduleStorage);

container.bind<SchedulerService>(Types.SchedulerService).to(SchedulerService);

container.bind<HelpMiddleware>(Types.HelpMiddleware).to(HelpMiddleware);

container.bind<NewScheduleMiddleware>(Types.NewScheduleMiddleware).to(NewScheduleMiddleware);
container.bind<CurrentScheduleMiddleware>(Types.CurrentScheduleMiddleware).to(CurrentScheduleMiddleware);
container.bind<DeleteScheduleMiddleware>(Types.DeleteScheduleMiddleware).to(DeleteScheduleMiddleware);

container.bind<DialogStateMiddleware>(Types.DialogStateMiddleware).to(DialogStateMiddleware);
container.bind<DialogStateMembersMiddleware>(Types.DialogStateMembersMiddleware).to(DialogStateMembersMiddleware);
container.bind<DialogStateIntervalMiddleware>(Types.DialogStateIntervalMiddleware).to(DialogStateIntervalMiddleware);
container.bind<DialogStateTimeMiddleware>(Types.DialogStateTimeMiddleware).to(DialogStateTimeMiddleware);
container.bind<DialogStateTeamSizeMiddleware>(Types.DialogStateTeamSizeMiddleware).to(DialogStateTeamSizeMiddleware);

container.bind<TelegrafBot>(Types.TelegrafBot).to(TelegrafBot);
