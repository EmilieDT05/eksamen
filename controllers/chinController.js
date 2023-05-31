const Todo = require('../models/chinModels');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'secret', (err, decodedToken) => {
            if (err) {
                // handle error
                reject(err);
            } else {
                console.log(decodedToken.id);
                resolve(decodedToken.id);
            }
        });
    });
}

const createTodo = async (req, res) => {
    const token = req.cookies.jwt
    const id = await verifyToken(token)
    const user = await User.findById(id)

    try {
        const {
            name,
        } = req.body;

        const todo = await Todo.create({
            name,
            author: user.email
        });
        res.status(201).json(todo);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Could not create Todo'
        });
    }
};

const getTodo = async (req, res) => {
    try {
        const token = req.cookies.jwt
        const id = await verifyToken(token)
        const user = await User.findById(id)

        const todos = await Todo.find({
            author: user.email
        });
        res.render('toDo', {
            todos
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error getting todos');
    }
};


const deleteTodo = async (req, res) => {
    const {
        id
    } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: 'Invalid todo ID'
        });
    }
    try {
        const todo = await Todo.findByIdAndDelete(id);
        if (!todo) {
            return res.status(404).json({
                message: 'Todo not found'
            });
        }
        res.status(200).json(todo);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error deleting Todo'
        });
    }
};


const getTodoById = async (req, res) => {
    const {
        id
    } = req.params;
    console.log(id)
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: 'Invalid todo ID'
        });
    }
    try {
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({
                message: 'Todo not found'
            });
        }
        res.status(200).json(todo);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error getting Todo'
        });
    }
};


const updateTodo = async (req, res) => {
    const {
        id
    } = req.params;
    const {
        name,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: 'Invalid ID'
        });
    }
    try {
        const todo = await Todo.findByIdAndUpdate(
            id, {
                name,
            }, {
                new: true
            }
        );

        if (!todo) {
            return res.status(404).json({
                message: 'Todo not found'
            });
        }
        res.status(200).json(todo);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error updating'
        });
    }
};




const markDone = async (req, res) => {
    const {
        id
    } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: 'Invalid ID'
        });
    }

    try {
        const todo = await Todo.findByIdAndUpdate(
            id, {
                done: true
            }, // Add 'done' field to the update
            {
                new: true
            }
        );

        if (!todo) {
            return res.status(404).json({
                message: 'Todo not found'
            });
        }

        res.status(200).json(todo);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error updating'
        });
    }
};

const markUndo = async (req, res) => {
    const {
        id
    } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: 'Invalid ID'
        });
    }

    try {
        const todo = await Todo.findByIdAndUpdate(
            id, {
                done: false
            }, // Add 'done' field to the update
            {
                new: true
            }
        );

        if (!todo) {
            return res.status(404).json({
                message: 'Todo not found'
            });
        }

        res.status(200).json(todo);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error updating'
        });
    }
}

module.exports = {
    createTodo,
    getTodo,
    getTodoById,
    updateTodo,
    deleteTodo,
    markDone,
    markUndo,
};