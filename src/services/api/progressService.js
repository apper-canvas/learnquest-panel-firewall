import { getApperClient } from "@/services/apperClient";

const progressService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("progress_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "child_id_c" } },
          { field: { Name: "last_active_c" } },
          { field: { Name: "math_level_c" } },
          { field: { Name: "reading_level_c" } },
          { field: { Name: "streak_c" } },
          { field: { Name: "total_stars_c" } },
          { field: { Name: "skills_mastered_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching progress:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById("progress_c", id, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "child_id_c" } },
          { field: { Name: "last_active_c" } },
          { field: { Name: "math_level_c" } },
          { field: { Name: "reading_level_c" } },
          { field: { Name: "streak_c" } },
          { field: { Name: "total_stars_c" } },
          { field: { Name: "skills_mastered_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching progress ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  getCurrentProgress: async () => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("progress_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "child_id_c" } },
          { field: { Name: "last_active_c" } },
          { field: { Name: "math_level_c" } },
          { field: { Name: "reading_level_c" } },
          { field: { Name: "streak_c" } },
          { field: { Name: "total_stars_c" } },
          { field: { Name: "skills_mastered_c" } }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data?.[0] || null;
    } catch (error) {
      console.error("Error fetching current progress:", error?.response?.data?.message || error);
      return null;
    }
  },

  update: async (id, data) => {
    try {
      const updateData = {
        Id: parseInt(id),
        last_active_c: new Date().toISOString()
      };

      if (data.total_stars_c !== undefined) updateData.total_stars_c = data.total_stars_c;
      if (data.math_level_c !== undefined) updateData.math_level_c = data.math_level_c;
      if (data.reading_level_c !== undefined) updateData.reading_level_c = data.reading_level_c;
      if (data.streak_c !== undefined) updateData.streak_c = data.streak_c;
      if (data.skills_mastered_c !== undefined) updateData.skills_mastered_c = data.skills_mastered_c;

      const apperClient = getApperClient();
      const response = await apperClient.updateRecord("progress_c", {
        records: [updateData]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update progress:`, failed);
          return null;
        }
        return response.results[0]?.data || null;
      }

      return null;
    } catch (error) {
      console.error("Error updating progress:", error?.response?.data?.message || error);
      return null;
    }
  },

  updateStars: async (starsToAdd) => {
    try {
      const currentProgress = await progressService.getCurrentProgress();
      if (!currentProgress) return null;

      const newTotal = (currentProgress.total_stars_c || 0) + starsToAdd;
      
      return await progressService.update(currentProgress.Id, {
        total_stars_c: newTotal
      });
    } catch (error) {
      console.error("Error updating stars:", error?.response?.data?.message || error);
      return null;
    }
  },

  updateLevel: async (subject, newLevel) => {
    try {
      const currentProgress = await progressService.getCurrentProgress();
      if (!currentProgress) return null;

      const updateData = {};
      if (subject === "math") {
        updateData.math_level_c = newLevel;
      } else if (subject === "reading") {
        updateData.reading_level_c = newLevel;
      }

      return await progressService.update(currentProgress.Id, updateData);
    } catch (error) {
      console.error("Error updating level:", error?.response?.data?.message || error);
      return null;
    }
  },

  addMasteredSkill: async (skill) => {
    try {
      const currentProgress = await progressService.getCurrentProgress();
      if (!currentProgress) return null;

      const skillsList = currentProgress.skills_mastered_c 
        ? currentProgress.skills_mastered_c.split('\n').filter(s => s.trim())
        : [];
      
      if (!skillsList.includes(skill)) {
        skillsList.push(skill);
        return await progressService.update(currentProgress.Id, {
          skills_mastered_c: skillsList.join('\n')
        });
      }

      return currentProgress;
    } catch (error) {
      console.error("Error adding mastered skill:", error?.response?.data?.message || error);
      return null;
    }
  },

  addBonusStars: async (bonusAmount) => {
    return await progressService.updateStars(bonusAmount);
  },

  getAchievementStats: async () => {
    // This is UI-specific data, keep in localStorage temporarily
    const stored = localStorage.getItem('learnquest_achievement_stats');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      timedChallengesCompleted: 0,
      fastestTime: null,
      totalBonusStarsEarned: 0,
      achievementsUnlocked: 0
    };
  },

  updateAchievementStats: async (newStats) => {
    const current = await progressService.getAchievementStats();
    const updated = { ...current, ...newStats };
    localStorage.setItem('learnquest_achievement_stats', JSON.stringify(updated));
    return updated;
  }
};

export default progressService;