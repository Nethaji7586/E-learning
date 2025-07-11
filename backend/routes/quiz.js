const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/auth")
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  deleteQuiz,
} = require("../controllers/quizController")

// Admin only route to create quiz
router.post("/", protect, createQuiz) // Optionally, check if req.user.role === "admin"

// Public quiz routes
router.get("/", getAllQuizzes)
router.get("/:id", getQuizById)
router.delete("/:id", protect, deleteQuiz)

module.exports = router
