import prisma from '@/lib/db.js';

export async function POST(req) {
    const { clerkUserId, email, name, imageUrl } = await req.json();

    // Check if user exists
    let user = await prisma.user.findUnique({
        where: { clerkUserId }
    });

    if (!user) {
        // Create user if not exists
        user = await prisma.user.create({
        data: { clerkUserId, email, name, imageUrl }
        });
    }

    return new Response(JSON.stringify({ user }), { status: 200 });
}