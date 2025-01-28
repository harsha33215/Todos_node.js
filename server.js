const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
const { get } = require("http");
const exp = require("constants");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "todo.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.mesaage}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// get todos

app.get("/todos/", async (req, res) => {
  const getTodosQuery = `SELECT * FROM todo ORDER BY Id;`;
  const todosArray = await db.all(getTodosQuery);
  res.send(todosArray);
});

// get todo

app.get("/todos/:todoId/", async (req, res) => {
  const { todoId } = req.params;
  const getTodoQuery = `SELECT * FROM todo WHERE id= ${todoId};`;
  const todo = await db.get(getTodoQuery);
  res.send(todo);
});

// add todo
app.post("/todos/", async (req, res) => {
  const todosDetails = req.body;
  const { name } = todosDetails;

  const addTodoQuery = `INSERT INTO todo(name) VALUES('${name}')`;
  const dbResponse = await db.run(addTodoQuery);
  const todoId = dbResponse.lastID;
  res.send({ id: todoId });
});

//update todo

app.put("/todos/:todoId/", async (req, res) => {
  const { todoId } = req.params;
  const todosDetails = req.body;
  const { name } = todosDetails;
  const updateTodoQuery = `UPDATE todo SET name='${name}' WHERE id= ${todoId};`;
  await db.run(updateTodoQuery);
  res.send("Book Update Successfully");
});

// delete todo

app.delete("/todos/:todoId/", async (req, res) => {
  const { todoId } = req.params;
  const deleteTodoQuery = `DELETE FROM todo  WHERE id= ${todoId};`;
  await db.run(deleteTodoQuery);
  res.send("Todo Deleted Successfully");
});
