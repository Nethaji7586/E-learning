const Answer = require("../models/Answer")
const Quiz = require("../models/Quiz")

// @desc    Submit answers to a quiz
// @route   POST /api/answers/:quizId
// @access  Private (student)
exports.submitAnswers = async (req, res) => {
  const { selectedAnswers } = req.body
  const { quizId } = req.params
  const studentId = req.user._id

  try {
    const quiz = await Quiz.findById(quizId)
    if (!quiz) return res.status(404).json({ message: "Quiz not found" })

    // ✅ Prevent multiple submissions
    const alreadySubmitted = await Answer.findOne({ quizId, studentId })
    if (alreadySubmitted) {
      return res.status(400).json({ message: "You have already submitted this quiz." })
    }

    if (selectedAnswers.length !== quiz.questions.length) {
      return res.status(400).json({ message: "Answer count mismatch" })
    }

    // ✅ Calculate score
    let score = 0
    quiz.questions.forEach((q, index) => {
      if (q.correctAnswer === selectedAnswers[index]) {
        score++
      }
    })

    const answerDoc = await Answer.create({
      quizId,
      studentId,
      selectedAnswers,
      score,
    })

    res.status(201).json({
      message: "Quiz submitted",
      score,
      total: quiz.questions.length,
      resultId: answerDoc._id,
    })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// @desc    Get student's result for a quiz
// @route   GET /api/answers/:quizId
// @access  Private (student)
exports.getStudentResult = async (req, res) => {
  try {
    const answer = await Answer.findOne({
      quizId: req.params.quizId,
      studentId: req.user._id
    }).populate("quizId", "title description")

    if (!answer) return res.status(404).json({ message: "Result not found" })
    res.json(answer)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}


// @desc    Admin: Get all results for a specific quiz
// @route   GET /api/answers/quiz/:quizId/all
// @access  Private (admin only)
exports.getAllResultsForQuiz = async (req, res) => {
  try {
    // Optional: Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." })
    }

    const results = await Answer.find({ quizId: req.params.quizId })
      .populate("studentId", "name email")
      .populate("quizId", "title")

    res.json(results)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}
