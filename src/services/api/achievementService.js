import { getApperClient } from "@/services/apperClient";

const achievementService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("achievement_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "condition_c" } },
          { field: { Name: "bonus_stars_c" } },
          { field: { Name: "unlocked_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "target_c" } },
          { field: { Name: "unlocked_at_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching achievements:", error?.response?.data?.message || error);
      return [];
    }
  },

  getUnlocked: async () => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("achievement_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "condition_c" } },
          { field: { Name: "bonus_stars_c" } },
          { field: { Name: "unlocked_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "target_c" } },
          { field: { Name: "unlocked_at_c" } }
        ],
        where: [
          {
            FieldName: "unlocked_c",
            Operator: "EqualTo",
            Values: [true]
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching unlocked achievements:", error?.response?.data?.message || error);
      return [];
    }
  },

  checkAchievements: async (sessionData) => {
    try {
      const achievements = await achievementService.getAll();
      const newlyUnlocked = [];
      const toUpdate = [];

      achievements.forEach(achievement => {
        if (achievement.unlocked_c) return;

        let shouldUnlock = false;

        switch (achievement.condition_c) {
          case "time_under_10":
            if (sessionData.averageTime && sessionData.averageTime < 10) {
              shouldUnlock = true;
            }
            break;

          case "time_under_5":
            if (sessionData.averageTime && sessionData.averageTime < 5) {
              shouldUnlock = true;
            }
            break;

          case "perfect_under_20":
            if (sessionData.accuracy === 100 && sessionData.averageTime && sessionData.averageTime < 20) {
              shouldUnlock = true;
            }
            break;

          case "streak_under_15":
            if (sessionData.averageTime && sessionData.averageTime < 15) {
              const newProgress = (achievement.progress_c || 0) + 1;
              if (newProgress >= achievement.target_c) {
                shouldUnlock = true;
              }
              toUpdate.push({
                Id: achievement.Id,
                progress_c: newProgress
              });
            } else {
              toUpdate.push({
                Id: achievement.Id,
                progress_c: 0
              });
            }
            break;

          case "timed_completions":
            if (sessionData.isTimed) {
              const newProgress = (achievement.progress_c || 0) + 1;
              if (newProgress >= achievement.target_c) {
                shouldUnlock = true;
              }
              toUpdate.push({
                Id: achievement.Id,
                progress_c: newProgress
              });
            }
            break;
        }

        if (shouldUnlock) {
          toUpdate.push({
            Id: achievement.Id,
            unlocked_c: true,
            unlocked_at_c: new Date().toISOString(),
            progress_c: achievement.target_c || achievement.progress_c
          });
          newlyUnlocked.push({ ...achievement, unlocked_c: true });
        }
      });

      if (toUpdate.length > 0) {
        const apperClient = getApperClient();
        const response = await apperClient.updateRecord("achievement_c", {
          records: toUpdate
        });

        if (!response.success) {
          console.error("Failed to update achievements:", response.message);
        }

        if (response.results) {
          const failed = response.results.filter(r => !r.success);
          if (failed.length > 0) {
            console.error(`Failed to update ${failed.length} achievements:`, failed);
          }
        }
      }

      return newlyUnlocked;
    } catch (error) {
      console.error("Error checking achievements:", error?.response?.data?.message || error);
      return [];
    }
  },

  calculateBonusStars: (completionTime, maxTime = 30) => {
    if (completionTime >= maxTime) return 0;

    const timeRatio = completionTime / maxTime;

    if (timeRatio <= 0.25) return 3;
    if (timeRatio <= 0.5) return 2;
    if (timeRatio <= 0.75) return 1;

    return 0;
  }
};

export default achievementService;