import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db.js';

export async function GET(request) {
    try{
        // Get user_id from query params
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get('user_id');
        if (!user_id) {
        return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
            }
        
        const db = await createConnection();
    const sql = "SELECT * FROM `todos` WHERE `user_id` = ?";
    const [todos] = await db.query(sql, [user_id]);
    return NextResponse.json({ todos });
    } catch (e) {
        return NextResponse.json({ error: e.message });
    }
}

// POST: Add a new todo
export async function POST(request) {
    try {
        const { user_id, text } = await request.json();
        if (!user_id || !text) {
        return NextResponse.json({ error: 'Missing user_id or text' }, { status: 400 });
        }
        const db = await createConnection();
        const sql = "INSERT INTO `todos` (`user_id`, `text`, `completed`) VALUES (?, ?, 0)";
        const [result] = await db.query(sql, [user_id, text]);
        return NextResponse.json({ id: result.insertId, user_id, text, completed: 0 });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// PUT: Update a todo
export async function PUT(request) {
    try {
        const { id, user_id, completed } = await request.json();
        if (typeof id === 'undefined' || typeof user_id === 'undefined' || typeof completed === 'undefined') {
        return NextResponse.json({ error: 'Missing id, user_id, or completed' }, { status: 400 });
        }
        const db = await createConnection();
        const sql = "UPDATE `todos` SET `completed` = ? WHERE `id` = ? AND `user_id` = ?";
        const [result] = await db.query(sql, [completed ? 1 : 0, id, user_id]);
        if (result.affectedRows === 0) {
        return NextResponse.json({ error: 'Todo not found or not authorized' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
} 
// DELETE: Remove a todo by id and user_id
export async function DELETE(request) {
    try {
        const { id, user_id } = await request.json();
        if (!id || !user_id) {
        return NextResponse.json({ error: 'Missing id or user_id' }, { status: 400 });
        }
        const db = await createConnection();
        const sql = "DELETE FROM `todos` WHERE `id` = ? AND `user_id` = ?";
        const [result] = await db.query(sql, [id, user_id]);
        if (result.affectedRows === 0) {
        return NextResponse.json({ error: 'Todo not found or not authorized' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}