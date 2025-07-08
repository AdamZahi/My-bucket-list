import prisma from '@/lib/db.js'; 

export async function GET(req, { params }) {
  const { id } = await params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  }

  try {
    const show = await prisma.my_list.findUnique({
      where: { id: Number(id) }
    });
    if (!show) {
      return new Response(JSON.stringify({ error: 'Show not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ show }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  }
  const body = await req.json();

  try {
    const updatedShow = await prisma.my_list.update({
      where: { id: Number(id) },
      data: body
    });
    return new Response(JSON.stringify(updatedShow), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  }

  try {
    await prisma.my_list.delete({
      where: { id: Number(id) }
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}