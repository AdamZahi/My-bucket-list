'use client';

import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useUser();
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(null); // null or the show object being edited
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({
    title: '',
    genre: '',
    form: 'TV show',
    overview: '',
    language: '',
    status: 'not started yet',
    additional_links: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch user's list
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/my_list?user_id=${user.id}`);
        const list = await res.json();
        if (Array.isArray(list.shows)) {
          setData(list.shows);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const toggleOverview = (id) => {
        setExpanded(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new show
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await fetch('/api/my_list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, user_id: user.id }),
      });
      const result = await res.json();
      if (result.id) {
        setData([
          ...data,
          {
            ...form,
            id: result.id,
            user_id: user.id,
          },
        ]);
        setForm({
          title: '',
          genre: '',
          form: 'TV show',
          overview: '',
          language: '',
          status: 'not started yet',
          additional_links: ''
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Delete show
  const handleDelete = async (id) => {
    if (!user) return;
    try {
      const res = await fetch('/api/my_list', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, user_id: user.id }),
      });
      const result = await res.json();
      if (result.success) {
        setData(data.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Go to details page
  const goToDetails = (id) => {
    router.push(`/my_list/${id}`);
  };

  if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 px-6">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-10 max-w-md text-center border border-white/40">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
          🎬 My Bucket List
        </h1>
        <p className="text-gray-600 mb-6 text-base">
          Save and track your dream experiences in one place. Sign in to get started.
        </p>
        <SignInButton mode="modal">
          <button className="px-6 py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all">
            🚀 Sign In
          </button>
        </SignInButton>
      </div>
    </div>
  );
}


  return (
    <div className="w-full mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">🎬 {user.firstName}&apos;s Bucket List</h1>
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "w-32 h-32",
            },
          }}
        />
      </div>

      <form className="flex flex-wrap gap-4 mb-10 bg-gray-50 p-6 rounded-lg shadow" onSubmit={handleSubmit}>
        <input
          name="title"
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="flex-1 min-w-[150px] px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="genre"
          type="text"
          placeholder="Genre"
          value={form.genre}
          onChange={handleChange}
          required
          className="flex-1 min-w-[120px] px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          name="form"
          value={form.form}
          onChange={handleChange}
          className="flex-1 min-w-[110px] px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="TV show">TV show</option>
          <option value="movie">Movie</option>
        </select>
        <textarea
          name="overview"
          placeholder="Overview"
          value={form.overview}
          onChange={handleChange}
          required
          className="flex-1 min-w-[180px] px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="language"
          type="text"
          placeholder="Language"
          value={form.language}
          onChange={handleChange}
          required
          className="flex-1 min-w-[100px] px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="flex-1 min-w-[150px] px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="not started yet">Not started yet</option>
          <option value="watching">Watching</option>
          <option value="stopped watching">Stopped watching</option>
          <option value="completed">Completed</option>
        </select>
        <input
          name="additional_links"
          type="text"
          placeholder="Additional Links (optional)"
          value={form.additional_links}
          onChange={handleChange}
          className="flex-1 min-w-[180px] px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition self-end"
          type="submit"
        >
          Add
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">My List</h2>
      {loading ? (
        <p className="text-lg">Loading... 📺</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg bg-white shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Genre</th>
                <th className="px-4 py-2 text-left">Form</th>
                <th className="px-4 py-2 text-left">Overview</th>
                <th className="px-4 py-2 text-left">Language</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Additional Links</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-gray-500">
                    No shows or movies yet. Add your first one! 🍿
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">{item.title}</td>
                    <td className="px-4 py-2">{item.genre}</td>
                    <td className="px-4 py-2">{item.form}</td>
                    {/* <td className="px-4 py-2 max-w-xs break-words whitespace-pre-line">{item.overview}</td> */}
                    <td className="py-3 px-2 sm:px-4 max-w-xs">
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => toggleOverview(item.id)}
                                            className="focus:outline-none mr-2"
                                            aria-label={expanded[item.id] ? "Collapse overview" : "Expand overview"}
                                        >
                                            <span className={`inline-block transform transition-transform duration-200 ${expanded[item.id] ? 'rotate-90' : ''}`}>
                                                ▶
                                            </span>
                                        </button>
                                        <span>
                                            {expanded[item.id]
                                                ? item.overview
                                                : item.overview.length > 35
                                                    ? item.overview.slice(0, 35) + '...'
                                                    : item.overview
                                            }
                                        </span>
                                    </div>
                                </td>
                    <td className="px-4 py-2">{item.language}</td>
                    <td className="px-4 py-2">{item.status}</td>
                    <td className="px-4 py-2">
                      {item.additional_links ? (
                        <a
                          href={item.additional_links}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Link
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => {
                          setEditForm(item);
                          setEditing(true);
                        }}
                        className="px-3 py-1 rounded bg-yellow-500 text-white text-sm hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => goToDetails(item.id)}
                        className="px-3 py-1 rounded bg-green-500 text-white text-sm hover:bg-green-600 transition"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {editing && editForm && (
  <div className="fixed inset-0 bg-blue-50 bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
        onClick={() => setEditing(false)}
        title="Close"
      >
        &times;
      </button>
      <h2 className="text-xl font-bold mb-4">Edit Show</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!user) return;
          try {
            const res = await fetch('/api/my_list', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...editForm, user_id: user.id }),
            });
            const result = await res.json();
            if (result.success) {
              setData(data.map((item) =>
                item.id === editForm.id ? { ...editForm } : item
              ));
              setEditing(false);
            }
          } catch (error) {
            console.error(error);
          }
        }}
        className="flex flex-col gap-3"
      >
        <input
          name="title"
          type="text"
          placeholder="Title"
          value={editForm.title}
          onChange={e => setEditForm({ ...editForm, title: e.target.value })}
          required
          className="px-3 py-2 rounded border border-gray-300"
        />
        <input
          name="genre"
          type="text"
          placeholder="Genre"
          value={editForm.genre}
          onChange={e => setEditForm({ ...editForm, genre: e.target.value })}
          required
          className="px-3 py-2 rounded border border-gray-300"
        />
        <select
          name="form"
          value={editForm.form}
          onChange={e => setEditForm({ ...editForm, form: e.target.value })}
          className="px-3 py-2 rounded border border-gray-300"
        >
          <option value="TV show">TV show</option>
          <option value="movie">Movie</option>
        </select>
        <textarea
          name="overview"
          placeholder="Overview"
          value={editForm.overview}
          onChange={e => setEditForm({ ...editForm, overview: e.target.value })}
          required
          className="px-3 py-2 rounded border border-gray-300"
        />
        <input
          name="language"
          type="text"
          placeholder="Language"
          value={editForm.language}
          onChange={e => setEditForm({ ...editForm, language: e.target.value })}
          required
          className="px-3 py-2 rounded border border-gray-300"
        />
        <select
          name="status"
          value={editForm.status}
          onChange={e => setEditForm({ ...editForm, status: e.target.value })}
          className="px-3 py-2 rounded border border-gray-300"
        >
          <option value="not started yet">Not started yet</option>
          <option value="watching">Watching</option>
          <option value="stopped watching">Stopped watching</option>
          <option value="completed">Completed</option>
        </select>
        <input
          name="additional_links"
          type="text"
          placeholder="Additional Links (optional)"
          value={editForm.additional_links || ''}
          onChange={e => setEditForm({ ...editForm, additional_links: e.target.value })}
          className="px-3 py-2 rounded border border-gray-300"
        />
        <button
          type="submit"
          className="mt-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  </div>
)}
        </div>
      )}
    </div>
  );
}