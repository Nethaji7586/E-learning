const mongoose = require("mongoose")

const answerSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  selectedAnswers: [Number],
  score: Number,
  submittedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Answer", answerSchema)
