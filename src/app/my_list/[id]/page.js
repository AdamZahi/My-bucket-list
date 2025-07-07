'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function DetailsPage() {
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchShow = async () => {
            try {
                const res = await fetch(`/api/my_list/${id}`);
                const data = await res.json();
                if (data && data.show) {
                    setShow(data.show);
                } else {
                    setShow(null);
                }
            } catch (error) {
                setShow(null);
            }
            setLoading(false);
        };
        fetchShow();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-lg text-blue-700 font-semibold">Loading...</div>
            </div>
        );
    }

    if (!show) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-lg text-red-600 font-semibold">Show not found.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8 px-2">
            <div className="bg-white rounded-xl shadow-lg shadow-gray-700/50 p-8 w-full max-w-xl">
                <h1 className="text-4xl font-bold mb-4 text-blue-700">{show.title}</h1>
                <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-md text-blue-700 px-3 py-1 rounded-full  font-semibold mr-2">{show.form}</span>
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-md font-semibold">{show.status}</span>
                </div>
                <div className="mb-4">
                    <span className="font-semibold text-gray-700">Genre: </span>
                    <span className="text-gray-600">{show.genre}</span>
                </div>
                <div className="mb-4">
                    <span className="font-semibold text-gray-700">Language: </span>
                    <span className="text-gray-600">{show.language}</span>
                </div>
                <div className="mb-6">
                    <span className="font-semibold text-gray-700 block mb-1">Overview:</span>
                    <p className="text-gray-700 bg-gray-50 rounded p-3">{show.overview}</p>
                </div>
                {show.additional_links && (
                    <div className="mb-6">
                        <a
                            href={show.additional_links}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            More Info
                        </a>
                    </div>
                )}

                <div className="flex gap-4 justify-end">
                    <Link href="/">
                        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded transition">
                            Home
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}