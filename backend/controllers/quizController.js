const Quiz = require("../models/Quiz")

// @desc    Create a new quiz (admin only)
// @route   POST /api/quizzes
exports.createQuiz = async (req, res) => {
  const { title, description, questions } = req.body

  if (!title || !questions || questions.length === 0) {
    return res.status(400).json({ message: "Title and at least one question required" })
  }

  try {
    const quiz = await Quiz.create({ title, description, questions })
    res.status(201).json(quiz)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// @desc    Get all quizzes
// @route   GET /api/quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("-questions.correctAnswer") // hide answers
    res.json(quizzes)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// @desc    Get single quiz (with questions)
// @route   GET /api/quizzes/:id
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select("-questions.correctAnswer") // hide answers
    if (!quiz) return res.status(404).json({ message: "Quiz not found" })
    res.json(quiz)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (admin only)
exports.deleteQuiz = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete quizzes" })
    }

    const deleted = await Quiz.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: "Quiz not found" })

    res.json({ message: "Quiz deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}
