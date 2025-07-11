const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const app = express()

// Load .env file
dotenv.config()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/quizzes", require("./routes/quiz"))
app.use("/api/answers", require("./routes/answer"))

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI )
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err.message))

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`)
})
