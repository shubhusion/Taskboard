import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUserId } from '@/lib/auth';

const VALID_STATUSES = ['todo', 'in-progress', 'done'];

export async function POST(req: Request) {
	try {
		const userId = await getSessionUserId();
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		const { title, status } = await req.json();
		if (!title || typeof title !== 'string' || !title.trim()) {
			return NextResponse.json({ error: 'Title required' }, { status: 400 });
		}
		if (!VALID_STATUSES.includes(status)) {
			return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
		}
		const task = await prisma.task.create({
			data: {
				title,
				status,
				userId: parseInt(userId, 10),
			},
		});
		return NextResponse.json({ task });
	} catch (err) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}

export async function GET() {
	try {
		const userId = await getSessionUserId();
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		const tasks = await prisma.task.findMany({
			where: { userId: parseInt(userId, 10) },
			orderBy: { createdAt: 'desc' },
		});
		return NextResponse.json({ tasks });
	} catch (err) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
