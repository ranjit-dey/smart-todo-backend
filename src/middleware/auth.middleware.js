import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' })

        const token = authHeader.split(' ')[1]
        if (!token) return res.status(401).json({ message: 'Token missing' })

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.id)
        if (!user)
            return res.status(401).json({
                message: 'User no longer exists. Please login again.',
            })

        req.user = user
        next()
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' })
    }
}

export default authMiddleware
