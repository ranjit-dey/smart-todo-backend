import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'

export const register = async (req, res) => {
    const { name, email, password } = req.body

    if (!name.trim() || !email.trim() || !password.trim())
        return res.status(400).json({ message: 'All fields required' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'User already exists' })

    const hashed = await bcrypt.hash(password, 10)

    await User.create({ name, email, password: hashed })

    res.status(201).json({ message: 'User registered successfully' })
}

export const login = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    })

    res.json({ token })
}
