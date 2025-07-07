import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db.js';

export async function GET(request, { params }) {
    const { id } = params;
    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    try {
        const db = await createConnection();
        const [rows] = await db.query('SELECT * FROM `my_list` WHERE id = ?', [id]);
        if (rows.length === 0) {
        return NextResponse.json({ error: 'Show not found' }, { status: 404 });
        }
        return NextResponse.json({ show: rows[0] });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}