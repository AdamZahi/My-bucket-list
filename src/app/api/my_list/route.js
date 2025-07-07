import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db.js';

// GET all shows for user
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    if (!user_id) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });

    const db = await createConnection();
    const [shows] = await db.query("SELECT * FROM `my_list` WHERE `user_id` = ?", [user_id]);
    return NextResponse.json({ shows });
}

// POST: Add new show
export async function POST(request) {
    const { user_id, title, genre, form, overview, language, status, additional_links } = await request.json();
    if (!user_id || !title || !genre || !form || !overview || !language || !status) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const db = await createConnection();
    const sql = "INSERT INTO `my_list` (`user_id`, `title`, `genre`, `form`, `overview`, `language`, `status`, `additional_links`, `created`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    const [result] = await db.query(sql, [user_id, title, genre, form, overview, language, status, additional_links]);
    return NextResponse.json({ id: result.insertId });
}

// PUT: Update show
export async function PUT(request) {
    const { id, user_id, title, genre, form, overview, language, status, additional_links } = await request.json();
    if (!id || !user_id) return NextResponse.json({ error: 'Missing id or user_id' }, { status: 400 });
    const db = await createConnection();
    const sql = "UPDATE `my_list` SET `title`=?, `genre`=?, `form`=?, `overview`=?, `language`=?, `status`=?, `additional_links`=? WHERE `id`=? AND `user_id`=?";
    const [result] = await db.query(sql, [title, genre, form, overview, language, status, additional_links, id, user_id]);
    if (result.affectedRows === 0) return NextResponse.json({ error: 'Not found or not authorized' }, { status: 404 });
    return NextResponse.json({ success: true });
}

// DELETE: Remove show
export async function DELETE(request) {
    const { id, user_id } = await request.json();
    if (!id || !user_id) return NextResponse.json({ error: 'Missing id or user_id' }, { status: 400 });
    const db = await createConnection();
    const sql = "DELETE FROM `my_list` WHERE `id`=? AND `user_id`=?";
    const [result] = await db.query(sql, [id, user_id]);
    if (result.affectedRows === 0) return NextResponse.json({ error: 'Not found or not authorized' }, { status: 404 });
    return NextResponse.json({ success: true });
}