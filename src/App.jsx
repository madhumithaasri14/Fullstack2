import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasklyTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [currentPage, setCurrentPage] = useState("dashboard");

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    category: "College",
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("tasklyTasks", JSON.stringify(tasks));
  }, [tasks]);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setTaskForm({
      ...taskForm,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!taskForm.title.trim()) {
      setMessage("Please enter a task title.");
      return;
    }

    if (!taskForm.dueDate) {
      setMessage("Please select a due date.");
      return;
    }

    if (editingId) {
      setTasks(
        tasks.map((task) =>
          task.id === editingId
            ? {
                ...task,
                ...taskForm,
              }
            : task
        )
      );

      setMessage("Task updated successfully!");
      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now(),
        ...taskForm,
        completed: false,
      };

      setTasks([...tasks, newTask]);
      setMessage("Task added successfully!");
    }

    setTaskForm({
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium",
      category: "College",
    });

    setTimeout(() => {
      setMessage("");
    }, 2500);

    setCurrentPage("tasks");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const editTask = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.category,
    });

    setEditingId(task.id);
    setCurrentPage("add");
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Completed" && task.completed) ||
      (filter === "Pending" && !task.completed);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="app">

      {/* NAVBAR */}

      <header className="header">
        <div className="logo">
          ✨ Taskly
        </div>

        <nav className="nav">
          <button
            className={currentPage === "dashboard" ? "active" : ""}
            onClick={() => setCurrentPage("dashboard")}
          >
            🏠 Dashboard
          </button>

          <button
            className={currentPage === "tasks" ? "active" : ""}
            onClick={() => setCurrentPage("tasks")}
          >
            📋 My Tasks
          </button>

          <button
            className={currentPage === "add" ? "active" : ""}
            onClick={() => {
              setEditingId(null);

              setTaskForm({
                title: "",
                description: "",
                dueDate: "",
                priority: "Medium",
                category: "College",
              });

              setMessage("");
              setCurrentPage("add");
            }}
          >
            ➕ Add Task
          </button>
        </nav>
      </header>

      {/* MAIN CONTENT */}

      <main className="main">

        {/* DASHBOARD */}

        {currentPage === "dashboard" && (
          <section>

            <div className="welcome">
              <div>
                <h1>Good Morning! 👋</h1>

                <p>
                  Stay organized and get things done today.
                </p>
              </div>

              <button
                className="primary-btn"
                onClick={() => setCurrentPage("add")}
              >
                + Add New Task
              </button>
            </div>

            {/* SUMMARY CARDS */}

            <div className="cards">

              <div className="card">
                <div className="card-icon">📋</div>

                <h3>Total Tasks</h3>

                <strong>{totalTasks}</strong>
              </div>

              <div className="card">
                <div className="card-icon">✅</div>

                <h3>Completed</h3>

                <strong>{completedTasks}</strong>
              </div>

              <div className="card">
                <div className="card-icon">⏳</div>

                <h3>Pending</h3>

                <strong>{pendingTasks}</strong>
              </div>
            </div>

            {/* PROGRESS */}

            <div className="progress-box">

              <div className="progress-header">
                <h2>Today's Progress</h2>

                <span>{progress}%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <p>
                {completedTasks} of {totalTasks} tasks completed
              </p>

            </div>

            {/* RECENT TASKS */}

            <div className="section-box">

              <div className="section-title">
                <h2>Recent Tasks</h2>

                <button
                  onClick={() => setCurrentPage("tasks")}
                  className="text-btn"
                >
                  View All →
                </button>
              </div>

              {tasks.length === 0 ? (
                <div className="empty">
                  <div>📝</div>

                  <h3>No tasks yet</h3>

                  <p>
                    Add your first task and start being productive!
                  </p>

                  <button
                    className="primary-btn"
                    onClick={() => setCurrentPage("add")}
                  >
                    Add Your First Task
                  </button>
                </div>
              ) : (
                <div className="mini-task-list">

                  {tasks.slice(-5).reverse().map((task) => (
                    <div
                      className={`mini-task ${
                        task.completed ? "completed-task" : ""
                      }`}
                      key={task.id}
                    >

                      <div>
                        <h3>{task.title}</h3>

                        <p>
                          {task.category} • {task.priority}
                        </p>
                      </div>

                      <span>
                        {task.completed
                          ? "✅ Completed"
                          : "⏳ Pending"}
                      </span>

                    </div>
                  ))}

                </div>
              )}

            </div>

          </section>
        )}

        {/* MY TASKS */}

        {currentPage === "tasks" && (
          <section>

            <div className="page-heading">
              <div>
                <h1>My Tasks 📋</h1>

                <p>
                  Manage, search and organize your tasks.
                </p>
              </div>

              <button
                className="primary-btn"
                onClick={() => setCurrentPage("add")}
              >
                + Add Task
              </button>
            </div>

            {/* SEARCH AND FILTER */}

            <div className="tools">

              <input
                type="text"
                placeholder="🔍 Search tasks..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value)
                }
              >
                <option value="All">All Tasks</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>

            </div>

            {/* TASK LIST */}

            <div className="task-list">

              {filteredTasks.length === 0 ? (
                <div className="empty">
                  <div>🔎</div>

                  <h3>No tasks found</h3>

                  <p>
                    Try adding a task or changing your search.
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (

                  <div
                    className={`task-item ${
                      task.completed ? "task-done" : ""
                    }`}
                    key={task.id}
                  >

                    <div className="task-check">

                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                      />

                    </div>

                    <div className="task-content">

                      <h3>{task.title}</h3>

                      {task.description && (
                        <p>{task.description}</p>
                      )}

                      <div className="task-info">

                        <span>
                          📅 {task.dueDate}
                        </span>

                        <span>
                          🏷️ {task.category}
                        </span>

                        <span
                          className={`priority ${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>

                      </div>

                    </div>

                    <div className="task-actions">

                      <button
                        onClick={() => editTask(task)}
                        title="Edit"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>

                    </div>

                  </div>

                ))
              )}

            </div>

          </section>
        )}

        {/* ADD / EDIT TASK */}

        {currentPage === "add" && (
          <section className="form-section">

            <div className="page-heading">

              <div>
                <h1>
                  {editingId
                    ? "Edit Task ✏️"
                    : "Create New Task ➕"}
                </h1>

                <p>
                  {editingId
                    ? "Update your task details."
                    : "Add a new task to your daily plan."}
                </p>
              </div>

            </div>

            <form
              className="task-form"
              onSubmit={handleSubmit}
            >

              {message && (
                <div className="message">
                  {message}
                </div>
              )}

              <div className="form-group">

                <label>
                  Task Title *
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Complete Python assignment"
                  value={taskForm.title}
                  onChange={handleInputChange}
                />

              </div>

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Add some details about your task..."
                  value={taskForm.description}
                  onChange={handleInputChange}
                  rows="4"
                ></textarea>

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Due Date *
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={taskForm.dueDate}
                    onChange={handleInputChange}
                  />

                </div>

                <div className="form-group">

                  <label>
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={taskForm.priority}
                    onChange={handleInputChange}
                  >
                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>
                  </select>

                </div>

              </div>

              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={taskForm.category}
                  onChange={handleInputChange}
                >

                  <option value="College">
                    College
                  </option>

                  <option value="Personal">
                    Personal
                  </option>

                  <option value="Work">
                    Work
                  </option>

                  <option value="Shopping">
                    Shopping
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              <div className="form-buttons">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setEditingId(null);
                    setCurrentPage("tasks");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  {editingId
                    ? "Update Task"
                    : "Add Task"}
                </button>

              </div>

            </form>

          </section>
        )}

      </main>

      {/* FOOTER */}

      <footer>
        <p>
          ✨ Taskly — Stay organized. Stay productive.
        </p>
      </footer>

    </div>
  );
}

export default App;