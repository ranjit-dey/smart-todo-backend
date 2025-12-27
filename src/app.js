import express from 'express'
import errorHandler from './middleware/error.middleware.js'
import authRoutes from './routes/auth.routes.js'
import taskRoutes from './routes/task.routes.js'

const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

app.get('/', (req, res) => {
    res.send('Smart Todo API is running')
})

app.use(errorHandler)

export default app
