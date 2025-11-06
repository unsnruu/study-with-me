import { dailyGoalThreadMondayJob, dailyGoalThreadOtherDaysJob } from "./dailyGoalThread.js";
import { dailyAchievementThreadJob } from "./dailyAchievmentThread.js";
import { weeklyAchievementThreadJob } from "./weeklyAchievementThread.js";
import { dailyCheckinThreadJob } from "./dailyCheckinThread.js";
import { weeklyGoalSetupThreadJob } from "./weeklyGoalThread.js";

// 활성화할 스케줄 작업을 이 배열에 추가합니다.
export const scheduleJobs = [
  dailyGoalThreadMondayJob,
  dailyGoalThreadOtherDaysJob,
  dailyAchievementThreadJob,
  weeklyAchievementThreadJob,
  dailyCheckinThreadJob,
  weeklyGoalSetupThreadJob,
];
