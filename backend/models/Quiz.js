const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [String], // 4 options
  correctAnswer: Number // index of correct answer (0–3)
})

const quizSchema = new mongoose.Schema({
  title: String,
  description: String,
  questions: [questionSchema],
})

module.exports = mongoose.model("Quiz", quizSchema)
