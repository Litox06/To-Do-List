import { useState, useEffect } from "react";
const API_BASE = "http://localhost:3001";

function App() {
  // Declaring state variables
  const [todos, setTodos] = useState([]); // Where To-dos will be stored
  const [popupActive, setPopupActive] = useState(false); // Popup for the create To-do button
  const [newTodo, setNewTodo] = useState(""); // Input field

  useEffect(() => { // This will only get called once the component mounts
    getTodos();
  }, [])

  const getTodos = () => {
    fetch(API_BASE + "/todos")
      .then(res => res.json()) // Response as JSON
      .then(data => setTodos(data))
      .catch(err => console.error("Error: ", err));
  }

  const completeTodo = async id => {
    const data = await fetch(API_BASE + "/todo/complete/" + id)
      .then(res => res.json()); // Fetching data from server, this converts JSON to JS

    setTodos(todos => todos.map(todo => {
      if (todo._id === data._id) { // If they're equal, mark it as complete.
        todo.complete = data.complete;
      }

      return todo;
    }));
  }

  const deleteTodo = async id => {
    const data = await fetch(API_BASE + "/todo/delete/" + id, {
      method: "DELETE"
    }).then(res => res.json());

    setTodos(todos => todos.filter(todo => todo._id !== data._id));
  }

  const addTodo = async () => {
    const data = await fetch(API_BASE + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json" // Telling API what kind of content we're using
      },
      body: JSON.stringify({ // Converts JS value or JS object to JSON string
        text: newTodo
      })
    }).then(res => res.json());

    setTodos([...todos, data]); // Getting all our current To-dos and the new data
    setPopupActive(false); // Hide pop-up once we've added a task
    setNewTodo(""); // Clearing the addTodo text for future use
  }

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <h4>Your tasks</h4>

      <div className="todos">
        {todos.length > 0 ? todos.map(todo => ( // Adding unique ID to each To-do child in the mapping
          <div className={
              "todo " + (todo.complete ? "is-complete" : "") // Check if tasks are completed
            } key={todo._id} onClick={() => completeTodo(todo._id)}>

              <div className="checkbox"></div>

              <div className="text">{todo.text}</div>

              <div className="date">Date created: {new Date(todo.timestamp).toDateString()}</div>

              <div className="delete-todo" onClick={(e) => {
                e.stopPropagation(); // Prevents propagation of the same event from being called
                deleteTodo(todo._id);
              }}
              >X</div>
          </div>
        )) : (
					<p>You currently have no tasks</p>
				)}
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>x</div>
          <div className="content">
            <h3>Add Task</h3>

            <input
              type="text" // Binding new To-do value to input field
              className="add-todo-input"
              onChange={e => setNewTodo(e.target.value)}
              value={newTodo}
            />

            <div className="button" onClick={addTodo}>Create Task</div>

          </div>
        </div>
      ) : ''}
    </div>
  );
}

export default App;
