"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { quizService } from "../services/quiz"

const CreateQuiz = () => {
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    questions: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          questionText: "",
          options: ["", "", "", ""],
          correctAnswer: null,
        },
      ],
    })
  }

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...quiz.questions]
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    }
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    })
  }

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quiz.questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    })
  }

  const removeQuestion = (index) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index)
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await quizService.createQuiz(quiz)
      navigate("/")
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create quiz")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row hfont justify-content-center">
      <div className="col-md-10">
        <div className="card shadow">
          <div className="card-header">
            <h2 className="mb-0">
              <i className="bi bi-plus-circle me-2"></i>
              Create New Quiz
            </h2>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="title" className="form-label">
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={quiz.title}
                    onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    value={quiz.description}
                    onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Questions</h4>
                <button type="button" className="btn btn-outline-primary" onClick={addQuestion}>
                  <i className="bi bi-plus me-2"></i>
                  Add Question
                </button>
              </div>

              {quiz.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="card mb-3">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Question {questionIndex + 1}</h6>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeQuestion(questionIndex)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Question Text</label>
                      <input
                        type="text"
                        className="form-control"
                        value={question.questionText}
                        onChange={(e) =>
                          updateQuestion(questionIndex, "questionText", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="row mb-3">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="col-md-6 mb-2">
                          <label className="form-label">Option {optionIndex + 1}</label>
                          <input
                            type="text"
                            className="form-control"
                            value={option}
                            onChange={(e) =>
                              updateOption(questionIndex, optionIndex, e.target.value)
                            }
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Correct Answer</label>
                      <select
                        className="form-select"
                        value={question.correctAnswer ?? ""}
                        onChange={(e) =>
                          updateQuestion(
                            questionIndex,
                            "correctAnswer",
                            parseInt(e.target.value)
                          )
                        }
                        required
                      >
                        <option value="">Select correct answer</option>
                        {question.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={optionIndex}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {quiz.questions.length === 0 && (
                <div className="text-center py-4">
                  <i className="bi bi-question-circle display-4 text-muted"></i>
                  <p className="text-muted mt-2">No questions added yet. Click "Add Question" to get started.</p>
                </div>
              )}

              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading || quiz.questions.length === 0}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Create Quiz
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateQuiz
