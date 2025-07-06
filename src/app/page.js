'use client';

import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function Home() {
  const {user}= useUser();
  console.log(user)
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState([]);
  
  const handleAddTodo = async (e) => {
  e.preventDefault();
  if (!newTodo.trim()) return;
  try {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, text: newTodo }),
    });
    const data = await res.json();
    if (data.id) {
      setTodos([...todos, data]);
      setNewTodo('');
    }
  } catch (error) {
    console.error(error);
  }
};

const handleToggleCompleted = async (id, newCompleted) => {
  try {
    const res = await fetch('/api/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, user_id: user.id, completed: newCompleted }),
    });
    const data = await res.json();
    if (data.success) {
      setTodos(todos.map(t =>
        t.id === id ? { ...t, completed: newCompleted ? 1 : 0 } : t
      ));
    }
  } catch (error) {
    console.error(error);
  }
};

  const handleDelete = async (id) => {
  try {
    const res = await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, user_id: user.id }),
    });
    const data = await res.json();
    if (data.success) {
      setTodos(todos.filter(t => t.id !== id));
    }
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
  if (!user) return; // Wait for user to be loaded

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/todos?user_id=${user.id}`);
      const data = await res.json();
      if (Array.isArray(data.todos)) {
        setTodos(data.todos);
      } else {
        setTodos([]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  fetchData();
}, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center mt-24 space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800">📝 Modern Todo App</h1>
        
        <SignInButton mode="modal">
          <button className="px-6 py-3 text-white text-lg font-medium bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition">
            Sign In
          </button>
        </SignInButton>
      </div>

    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 rounded-2xl bg-white/70 shadow-xl backdrop-blur-lg border border-white/30 transition-all">
  <div className="flex items-center justify-between">
    <h1 className="text-2xl font-semibold text-gray-800">
      📝 {user.firstName}&apos;s Todos
    </h1>
    <SignOutButton>
      <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition">
        🚪 Sign Out
      </button>
    </SignOutButton>
  </div>

  <form className="flex mt-6 space-x-2" onSubmit={handleAddTodo}>
    <input
      type="text"
      placeholder="Add a new todo..."
      value={newTodo}
      onChange={e => setNewTodo(e.target.value)}
      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <button
      type="submit"
      className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
    >
      ➕ Add
    </button>
  </form>

  <ul className="mt-6 space-y-3">
    {todos.map((t) => (
      <li
        key={t.id}
        className="flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-sm"
      >
        <label className="flex items-center space-x-3 flex-1">
          <input
            type="checkbox"
            checked={!!t.completed}
            onChange={() => handleToggleCompleted(t.id, !t.completed)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span
            className={`text-base ${
              t.completed ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          >
            {t.text}
          </span>
        </label>
        <button
          onClick={() => handleDelete(t.id)}
          className="text-xl hover:scale-110 transition"
          title="Delete todo"
        >
          🗑️
        </button>
      </li>
    ))}
  </ul>
</div>

  );
}