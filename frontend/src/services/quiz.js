// src/services/quizService.js
import api from "./api"   // ← your configured Axios instance

export const quizService = {
  // ----------------- quizzes -----------------
  getAllQuizzes: async () => {
    const { data } = await api.get("/quizzes")
    return data
  },

  getQuizById: async (id) => {
    const { data } = await api.get(`/quizzes/${id}`)
    return data
  },

  createQuiz: async (quizData) => {
    const { data } = await api.post("/quizzes", quizData)
    return data
  },

  deleteQuiz: async (id) => {
    const { data } = await api.delete(`/quizzes/${id}`)
    return data
  },

  // ----------------- answers -----------------
  /**
   * Submit the user's answers.
   * @param {string} quizId MongoDB ID of the quiz
   * @param {number[]} selectedAnswers array of option indexes, e.g. [0,2,1]
   */
  submitAnswers: async (quizId, selectedAnswers) => {
    // ensure we send pure numbers in the correct property name
    const numeric = selectedAnswers.map(Number)
    const { data } = await api.post(`/answers/${quizId}`, {
      selectedAnswers: numeric,
    })
    return data
  },

  getMyResult: async (quizId) => {
    const { data } = await api.get(`/answers/${quizId}`)
    return data
  },

  getAllResults: async (quizId) => {
    const { data } = await api.get(`/answers/quiz/${quizId}/all`)
    return data
  },
}
