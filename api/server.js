const express = require("express"); // Creating functions required to load modules to give us access to their exports
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/mern-todo", { // Mongoose connection options
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to DB"))
    .catch(console.error);

const Todo = require("./models/Todo"); // Importing model to use in our App


// NOTE: Some HTTP request have asynchronous request so the client continues
// execution  after initiating the request and processes the result
// whenever the App makes it available

app.get("/todos", async (req, res) => { // GET REQUEST: Find our To-dos using models connected to DB and pass them to "const todos"
    const todos = await Todo.find();

    res.json(todos);
})

app.post("/todo/new", (req, res) => { // POST REQUEST: Create new To-do in our MongoDB collection
    const todo = new Todo({
        text: req.body.text
    });

    todo.save(); // Built-in Mongoose function to save To-do to collection

    res.json(todo); // Pass us back new To-do to add it to our list
})

app.delete("/todo/delete/:id", async (req, res) => { // DELETE REQUEST: Find To-do ID in Mongodb and delete from collection
    const result = await Todo.findByIdAndDelete(req.params.id); // Built-in Mongoose function to find the ID and delete it

    res.json(result);
});

app.put("/todo/complete/:id", async (req, res) => { // UPDATE REQUEST: 
    const todo = await Todo.findById(req.params.id) // Built-in Mongoose function

    todo.complete = !todo.complete; // Flip the complete value

    todo.save();

    res.json(todo);
})
app.listen(3001, () => console.log("Server started on port: 3001"));   