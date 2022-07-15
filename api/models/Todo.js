const mongoose = require('mongoose'), timestamps = require('mongoose-timestamp')
const Schema = mongoose.Schema;

const TodoSchema = new Schema({ // Creating To-do Schema
    text: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: String,
        default: Date()
    }
})

const Todo = mongoose.model("Todo", TodoSchema) // Creating the Mongoose model, naming it and passing the Schema

module.exports = Todo;