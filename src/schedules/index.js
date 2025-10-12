import { dailyGoalThreadJob } from "./dailyGoalThread.js";
import { dailyAchievementThreadJob } from "./dailyAchievmentThread.js";
import { weeklyAchievementThreadJob } from "./weeklyAchievementThread.js";
import { dailyCheckinThreadJob } from "./dailyCheckinThread.js";

// 활성화할 스케줄 작업을 이 배열에 추가합니다.
export const scheduleJobs = [
  dailyGoalThreadJob,
  dailyAchievementThreadJob,
  weeklyAchievementThreadJob,
  dailyCheckinThreadJob,
];
