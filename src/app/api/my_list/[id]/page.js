import Link from "next/link";
export default function EditPage() {
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const [form, setForm] = useState({
        title: '',
        genre: '',
        overview: '',
        status: '',
        language: '',
        form: '',
        additional_links: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8 px-2">
            <div className="bg-white rounded-xl shadow-lg shadow-gray-700/50 p-8 w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Edit Show</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Title"
                        required
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="text"
                        name="genre"
                        value={form.genre}
                        onChange={e => setGenre(e.target.value)}
                        placeholder="Genre"
                        required
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <textarea
                        name="overview"
                        value={form.overview}
                        placeholder="Overview"
                        required
                        onChange={e => setOverview(e.target.value)}
                        rows={3}
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    />
                    <select
                        name="status"
                        value={form.status}
                        onChange={e => setStatus(e.target.value)}
                        required
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="No Started Yet">No Started Yet</option>
                        <option value="Completed">Completed</option>
                        <option value="Watching...">Watching...</option>
                        <option value="We Stopped Watching it">We Stopped Watching it</option>
                    </select>
                    <input
                        type="text"
                        name="language"
                        value={form.language}
                        onChange={e => setLanguage(e.target.value)}
                        placeholder="Language"
                        required
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <select
                        name="form"
                        value={e => setForm(e.target.value)}
                        required
                        onChange={handleChange}
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select Type</option>
                        <option value="Movie">Movie</option>
                        <option value="TV Show">TV Show</option>
                    </select>
                    <input
                        type="url"
                        name="additional_links"
                        value={e => setAdditionalLinks(e.target.value)}
                        onChange={handleChange}
                        placeholder="Additional Link (optional)"
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <div className='flex justify-around'>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded transition disabled:opacity-60"
                        >
                            {loading ? 'Saving...' : 'Edit Show'}
                        </button>
                        <Link to='/'>
                            <button className='bg-yellow-400 hover:bg-yellow-500 text-white font-bold p-3 rounded transition disabled:opacity-60' type="button">
                                Go Back
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

