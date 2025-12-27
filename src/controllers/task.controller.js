import Task from '../models/Task.model.js'
import isValidObjectId from '../utils/validateObjectId.js'

export const createTask = async (req, res) => {
    const { title, description } = req.body
    if (!title) return res.status(400).json({ message: 'Task title is required' })
    if (!description) return res.status(400).json({ message: 'Task description is required' })

    const task = await Task.create({
        title,
        description,
        user: req.user._id,
    })

    res.status(201).json(task)
}

export const getTasks = async (req, res) => {
    const tasks = await Task.find({ user: req.user._id })
    res.json(tasks)
}

export const updateTask = async (req, res) => {
    const { id } = req.params

    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid task ID' })

    const task = await Task.findOne({ _id: id, user: req.user._id })
    if (!task) return res.status(404).json({ message: 'Task not found' })

    Object.assign(task, req.body)
    await task.save()

    res.json({ message: 'Task updated successfully', task })
}

export const deleteTask = async (req, res) => {
    const { id } = req.params

    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid task ID' })

    const task = await Task.findOneAndDelete({
        _id: id,
        user: req.user._id,
    })

    if (!task) return res.status(404).json({ message: 'Task not found' })

    res.json({ message: 'Task deleted successfully' })
}
