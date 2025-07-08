import prisma from '@/lib/db.js'; 

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');
  if (!user_id) {
    return new Response(JSON.stringify({ error: 'Missing user_id' }), { status: 400 });
  }

  try {
    const shows = await prisma.my_list.findMany({
      where: { user_id }
    });
    return new Response(JSON.stringify({ shows }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  const body = await req.json();
  const {
    user_id,
    title,
    genre,
    form,
    overview,
    language,
    status,
    additional_links
  } = body;

  if (!user_id || !title || !genre || !form || !language) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  try {
    const newShow = await prisma.my_list.create({
      data: {
        user_id,
        title,
        genre,
        form,
        overview,
        language,
        status,
        additional_links
      }
    });
    return new Response(JSON.stringify(newShow), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  const body = await req.json();
  const { id, user_id } = body;

  if (!id || !user_id) {
    return new Response(JSON.stringify({ error: 'Missing id or user_id' }), { status: 400 });
  }

  try {
    await prisma.my_list.delete({
      where: { id: Number(id), user_id }
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}