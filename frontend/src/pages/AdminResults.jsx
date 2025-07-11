"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { quizService } from "../services/quiz"

const AdminResults = () => {
  const { quizId } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizData, resultsData] = await Promise.all([
          quizService.getQuizById(quizId),
          quizService.getAllResults(quizId),
        ])
        setQuiz(quizData)
        setResults(resultsData)
      } catch (error) {
        setError("Failed to load results")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [quizId])

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
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </div>
    )
  }

  const averageScore =
    results.length > 0 ? (results.reduce((sum, result) => sum + result.score, 0) / results.length).toFixed(1) : 0

  const passRate =
    results.length > 0 ? ((results.filter((result) => result.score >= 60).length / results.length) * 100).toFixed(1) : 0

  return (
    <div className="container-fluid hfont px-3 px-md-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div className="mb-3 mb-md-0">
          <h1>
            <i className="bi bi-bar-chart me-2"></i>
            Quiz Results
          </h1>
          <p className="text-muted">{quiz?.title}</p>
        </div>
        <Link to="/" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Dashboard
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <i className="bi bi-people display-4"></i>
              <h3 className="mt-2">{results.length}</h3>
              <p className="mb-0">Total Attempts</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <i className="bi bi-graph-up display-4"></i>
              <h3 className="mt-2">{averageScore}%</h3>
              <p className="mb-0">Average Score</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <i className="bi bi-check-circle display-4"></i>
              <h3 className="mt-2">{passRate}%</h3>
              <p className="mb-0">Pass Rate</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <i className="bi bi-question-circle display-4"></i>
              <h3 className="mt-2">{quiz?.questions?.length || 0}</h3>
              <p className="mb-0">Questions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="card shadow mb-5">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-table me-2"></i>
            Student Results
          </h5>
        </div>
        <div className="card-body">
          {results.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-inbox display-4 text-muted"></i>
              <h5 className="mt-3">No results yet</h5>
              <p className="text-muted">Students haven't taken this quiz yet.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Score</th>
                    <th>Correct</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td>
                        <i className="bi bi-person me-2"></i>
                        {result.studentId?.name || "Unknown"}
                      </td>
                      <td className="text-truncate" style={{ maxWidth: "140px" }}>
                        {result.studentId?.email || "N/A"}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            result.score >= quiz.questions.length * 0.8
                              ? "bg-success"
                              : result.score >= quiz.questions.length * 0.6
                              ? "bg-warning"
                              : "bg-danger"
                          }`}
                        >
                          {result.score} / {quiz.questions.length}
                        </span>
                      </td>
                      <td>
                        {result.correctAnswers} / {quiz?.questions?.length || 0}
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(result.submittedAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        {result.score >= quiz.questions.length * 0.6 ? (
                          <span className="badge bg-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Passed
                          </span>
                        ) : (
                          <span className="badge bg-danger">
                            <i className="bi bi-x-circle me-1"></i>
                            Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminResults
