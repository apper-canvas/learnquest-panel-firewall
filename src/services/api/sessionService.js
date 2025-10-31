import { getApperClient } from "@/services/apperClient";

const sessionService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("session_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "accuracy_c" } },
          { field: { Name: "challenges_completed_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "stars_earned_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "is_timed_c" } },
          { field: { Name: "average_time_c" } },
          { field: { Name: "bonus_stars_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching sessions:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById("session_c", id, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "accuracy_c" } },
          { field: { Name: "challenges_completed_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "stars_earned_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "is_timed_c" } },
          { field: { Name: "average_time_c" } },
          { field: { Name: "bonus_stars_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching session ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  getRecent: async (count = 5) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("session_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "accuracy_c" } },
          { field: { Name: "challenges_completed_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "stars_earned_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "is_timed_c" } },
          { field: { Name: "average_time_c" } },
          { field: { Name: "bonus_stars_c" } }
        ],
        orderBy: [{ fieldName: "timestamp_c", sorttype: "DESC" }],
        pagingInfo: { limit: count, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching recent sessions:", error?.response?.data?.message || error);
      return [];
    }
  },

  create: async (sessionData) => {
    try {
      const createData = {
        Name: `Session ${new Date().toLocaleString()}`,
        timestamp_c: new Date().toISOString(),
        subject_c: sessionData.subject || "",
        challenges_completed_c: sessionData.challengesCompleted || 0,
        stars_earned_c: sessionData.starsEarned || 0,
        accuracy_c: sessionData.accuracy || 0,
        duration_c: sessionData.duration || 0,
        is_timed_c: sessionData.isTimed || false,
        average_time_c: sessionData.averageTime || null,
        bonus_stars_c: sessionData.bonusStars || 0
      };

      const apperClient = getApperClient();
      const response = await apperClient.createRecord("session_c", {
        records: [createData]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create session:`, failed);
          return null;
        }
        return response.results[0]?.data || null;
      }

      return null;
    } catch (error) {
      console.error("Error creating session:", error?.response?.data?.message || error);
      return null;
    }
  }
};

export default sessionService;