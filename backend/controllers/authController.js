const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// @route   POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: "User already exists" })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword, role })

    const token = generateToken(user._id)
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "Invalid credentials" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })

    const token = generateToken(user._id)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json(req.user)
}
