"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { quizService } from "../services/quiz"

const QuizDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await quizService.getQuizById(id)
        setQuiz(quizData)

        try {
          const resultData = await quizService.getMyResult(id)
          setResult(resultData)
        } catch {
          // No previous result
        }
      } catch (err) {
        console.error(err)
        setError("Failed to load quiz")
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [id])

  const handleAnswerChange = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const selectedAnswers = quiz.questions.map((q) => answers[q._id])

      if (selectedAnswers.includes(undefined)) {
        setError("Please answer all questions.")
        setSubmitting(false)
        return
      }

      const resultData = await quizService.submitAnswers(id, selectedAnswers)
      setResult(resultData)
    } catch (error) {
      console.error(error)
      setError(error.response?.data?.message || "Failed to submit quiz")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="alert alert-danger container">{error}</div>
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div className="alert alert-warning container">Quiz not found or has no questions.</div>
  }

  if (result) {
    return (
      <div className="container hfont my-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow">
              <div className="card-body text-center">
                <div className="mb-4">
                  <i className="bi bi-check-circle display-1 text-success"></i>
                  <h2 className="mt-3">Quiz Completed!</h2>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-sm-4">
                    <div className="card bg-primary text-white">
                      <div className="card-body text-center">
                        <h3>{result.score}</h3>
                        <p className="mb-0">Your Score</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4">
                    <div className="card bg-success text-white">
                      <div className="card-body text-center">
                        <h3>{result.score}</h3>
                        <p className="mb-0">Correct</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4">
                    <div className="card bg-info text-white">
                      <div className="card-body text-center">
                        <h3>{quiz.questions.length}</h3>
                        <p className="mb-0">Total</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button className="btn btn-primary" onClick={() => navigate("/")}>
                    <i className="bi bi-house me-2"></i>
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container hfont my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow">
            <div className="card-header">
              <h2 className="mb-0">
                <i className="bi bi-question-circle me-2"></i>
                {quiz.title}
              </h2>
              <p className="text-muted mb-0">{quiz.description}</p>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {quiz.questions.map((question, index) => (
                  <div key={question._id || index} className="mb-4">
                    <h5 className="mb-3">
                      {index + 1}. {question.questionText || "Untitled Question"}
                    </h5>
                    <div className="ms-3">
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={question._id}
                            id={`${question._id}_${optionIndex}`}
                            value={optionIndex}
                            checked={answers[question._id] === optionIndex}
                            onChange={() => handleAnswerChange(question._id, optionIndex)}
                            required
                          />
                          <label className="form-check-label" htmlFor={`${question._id}_${optionIndex}`}>
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="d-flex justify-content-between mt-4">
                  <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>
                    <i className="bi bi-arrow-left me-2"></i>
                    Back
                  </button>
                  <button type="submit" className="btn btn-success" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Submit Quiz
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizDetail
