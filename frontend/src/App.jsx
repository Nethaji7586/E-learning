import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import QuizDetail from "./pages/QuizDetail"
import CreateQuiz from "./pages/CreateQuiz"
import AdminResults from "./pages/AdminResults"
import ProtectedRoute from "./components/ProtectedRoute"
import './App.css'

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <QuizDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-quiz"
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/results/:quizId"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminResults />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default App
