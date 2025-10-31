import { getApperClient } from "@/services/apperClient";

const challengeService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("challenge_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "audio_url_c" } },
          { field: { Name: "comprehension_question_c" } },
          { field: { Name: "correct_answer_c" } },
          { field: { Name: "difficulty_c" } },
          { field: { Name: "image_c" } },
          { field: { Name: "points_c" } },
          { field: { Name: "question_c" } },
          { field: { Name: "skill_c" } },
          { field: { Name: "sound_c" } },
          { field: { Name: "story_c" } },
          { field: { Name: "target_word_c" } },
          { field: { Name: "type_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching challenges:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById("challenge_c", id, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "audio_url_c" } },
          { field: { Name: "comprehension_question_c" } },
          { field: { Name: "correct_answer_c" } },
          { field: { Name: "difficulty_c" } },
          { field: { Name: "image_c" } },
          { field: { Name: "points_c" } },
          { field: { Name: "question_c" } },
          { field: { Name: "skill_c" } },
          { field: { Name: "sound_c" } },
          { field: { Name: "story_c" } },
          { field: { Name: "target_word_c" } },
          { field: { Name: "type_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching challenge ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  getByType: async (type) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("challenge_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "audio_url_c" } },
          { field: { Name: "comprehension_question_c" } },
          { field: { Name: "correct_answer_c" } },
          { field: { Name: "difficulty_c" } },
          { field: { Name: "image_c" } },
          { field: { Name: "points_c" } },
          { field: { Name: "question_c" } },
          { field: { Name: "skill_c" } },
          { field: { Name: "sound_c" } },
          { field: { Name: "story_c" } },
          { field: { Name: "target_word_c" } },
          { field: { Name: "type_c" } }
        ],
        where: [
          {
            FieldName: "type_c",
            Operator: "EqualTo",
            Values: [type]
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching challenges by type ${type}:`, error?.response?.data?.message || error);
      return [];
    }
  },

  getBySkillAndDifficulty: async (skill, difficulty) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("challenge_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "audio_url_c" } },
          { field: { Name: "comprehension_question_c" } },
          { field: { Name: "correct_answer_c" } },
          { field: { Name: "difficulty_c" } },
          { field: { Name: "image_c" } },
          { field: { Name: "points_c" } },
          { field: { Name: "question_c" } },
          { field: { Name: "skill_c" } },
          { field: { Name: "sound_c" } },
          { field: { Name: "story_c" } },
          { field: { Name: "target_word_c" } },
          { field: { Name: "type_c" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "skill_c",
                    operator: "EqualTo",
                    values: [skill]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "difficulty_c",
                    operator: "EqualTo",
                    values: [parseInt(difficulty)]
                  }
                ],
                operator: "OR"
              }
            ]
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching challenges by skill/difficulty:`, error?.response?.data?.message || error);
      return [];
    }
  },

  getRandomByType: async (type, count = 5) => {
    try {
      const challenges = await challengeService.getByType(type);
      const shuffled = [...challenges].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    } catch (error) {
      console.error(`Error getting random challenges:`, error?.response?.data?.message || error);
      return [];
    }
  }
};

export default challengeService;