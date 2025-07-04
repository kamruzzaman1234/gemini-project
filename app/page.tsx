"use client";


import { useState } from "react";
import './globals.css';

interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  dueDate: string;
  subtasks?: string[];
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const handleAddOrUpdateTask = () => {
    if (editingTaskId !== null) {
      setTasks(tasks.map(task => task.id === editingTaskId ? {
        ...task,
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate
      } : task));
      setEditingTaskId(null);
    } else {
      const task: Task = {
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        status: "pending",
        dueDate: newTask.dueDate,
      };
      setTasks([...tasks, task]);
    }
    setNewTask({ title: "", description: "", dueDate: "" });
  };

  const handleEditTask = (task: Task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
    });
    setEditingTaskId(task.id);
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleToggleStatus = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, status: task.status === "pending" ? "completed" : "pending" }
          : task
      )
    );
  };

  const handleSuggestSubtasks = async (task: Task) => {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: `Break this task into 3-5 subtasks: ${task.title}` }),
    });

    const data = await response.json();
    const subtasks = data.output.split(/\n|\d+\.|\*/).filter((s: string) => s.trim());
    setTasks(
      tasks.map((t) => (t.id === task.id ? { ...t, subtasks } : t))
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8`"> Smart Task Manager</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6 space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <br />
          <button
            onClick={handleAddOrUpdateTask}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md transition"
          >
            <br />
            {editingTaskId !== null ? "Update Task" : "Add Task"}
          </button>
        </div>

        <ul className="space-y-6">
          {tasks.map((task) => (
            <li key={task.id} className="bg-white shadow-md rounded-lg p-6 transition hover:shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800">{task.title}</h3>
                  <p className="text-gray-600 mt-1">{task.description}</p>
                  <p className="text-sm text-gray-500 mt-1">Due: {task.dueDate}</p>
                  <p className={`text-sm mt-2 font-medium ${task.status === "completed" ? "text-green-600" : "text-yellow-600"}`}>
                    Status: {task.status}
                  </p>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleToggleStatus(task.id)} className="text-sm text-blue-600 hover:underline">
                    Toggle
                  </button>
                  <br />
                  <button onClick={() => handleEditTask(task)} className="text-sm text-orange-500 hover:underline">
                    Edit
                  </button>
                  <br />
                  <button onClick={() => handleDeleteTask(task.id)} className="text-sm text-red-500 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleSuggestSubtasks(task)}
                className="mt-4 text-sm text-purple-600 hover:underline"
              >
                Suggest Subtasks
              </button>
              {task.subtasks && (
                <ul className="list-disc list-inside mt-3 text-sm text-gray-700">
                  {task.subtasks.map((subtask, index) => (
                    <li key={index}>{subtask}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
