const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/auth")
const { getAllResultsForQuiz } = require("../controllers/answerController")

const {
  submitAnswers,
  getStudentResult
} = require("../controllers/answerController")

// Submit quiz answers
router.post("/:quizId", protect, submitAnswers)

// Get result of a quiz
router.get("/:quizId", protect, getStudentResult)

router.get("/quiz/:quizId/all", protect, getAllResultsForQuiz)

module.exports = router
