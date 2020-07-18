export const Types = {
  RedisService: Symbol.for("RedisService"),

  DialogStateStorage: Symbol.for("DialogStateStorage"),
  DutyScheduleDraftStorage: Symbol.for("DutyScheduleDraftStorage"),
  DutyScheduleStorage: Symbol.for("DutyScheduleStorage"),

  SchedulerService: Symbol.for("SchedulerService"),

  IntervalView: Symbol.for("IntervalView"),
  DutyScheduleView: Symbol.for("DutyScheduleView"),

  HelpMiddleware: Symbol.for("HelpMiddleware"),
  CancelMiddleware: Symbol.for("CancelMiddleware"),

  NewScheduleMiddleware: Symbol.for("NewScheduleMiddleware"),
  CurrentScheduleMiddleware: Symbol.for("CurrentScheduleMiddleware"),
  DeleteScheduleMiddleware: Symbol.for("DeleteScheduleMiddleware"),

  DialogStateMiddleware: Symbol.for("DialogStateMiddleware"),
  DialogStateMembersMiddleware: Symbol.for("DialogStateMembersMiddleware"),
  DialogStateIntervalMiddleware: Symbol.for("DialogStateIntervalMiddleware"),
  DialogStateTeamSizeMiddleware: Symbol.for("DialogStateTeamSizeMiddleware"),
  DialogStateTimeMiddleware: Symbol.for("DialogStateTimeMiddleware"),

  TelegrafBot: Symbol.for("TelegrafBot"),
};
