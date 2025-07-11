"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { quizService } from "../services/quiz"

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useAuth()

  const fetchQuizzes = async () => {
    try {
      const data = await quizService.getAllQuizzes()
      setQuizzes(data)
    } catch (err) {
      console.error(err)
      setError("Failed to load quizzes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const handleDelete = async (quizId) => {
    const confirm = window.confirm("Are you sure you want to delete this quiz?")
    if (!confirm) return

    try {
      await quizService.deleteQuiz(quizId)
      setQuizzes((prev) => prev.filter((q) => q._id !== quizId))
    } catch (err) {
      console.error(err)
      alert("Failed to delete quiz")
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center hfont align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="hfont">
      <div className="d-flex hfont justify-content-between align-items-center mb-4">
        <div>
          <h1>
            Dashboard
          </h1>
          <p className="text-muted">Welcome, {user?.name || "User"}!</p>
        </div>
        {user?.role === "admin" && (
          <Link to="/create-quiz" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Create Quiz
          </Link>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {quizzes.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-question-circle display-1 text-muted"></i>
          <h3 className="mt-3">No quizzes available</h3>
          <p className="text-muted">Check back later for new quizzes!</p>
        </div>
      ) : (
        <div className="row">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">
                    <i className="bi bi-question-circle me-2 text-primary"></i>
                    {quiz.title}
                  </h5>
                  <p className="card-text flex-grow-1">{quiz.description}</p>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <small className="text-muted">
                        <i className="bi bi-list-ol me-1"></i>
                        {quiz.questions?.length || 0} questions
                      </small>
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {quiz.timeLimit || "No limit"}
                      </small>
                    </div>
                    <div className="d-flex gap-2">
                      <Link to={`/quiz/${quiz._id}`} className="btn btn-primary flex-grow-1">
                        <i className="bi bi-play-circle me-1"></i>
                        Take Quiz
                      </Link>
                      {user?.role === "admin" && (
                        <>
                          <Link to={`/admin/results/${quiz._id}`} className="btn btn-outline-secondary">
                            <i className="bi bi-bar-chart"></i>
                          </Link>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(quiz._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
