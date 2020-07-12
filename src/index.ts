import {schedulerService} from "./services/SchedulerService";

schedulerService.init().catch(error => {
    console.log(error)
})
