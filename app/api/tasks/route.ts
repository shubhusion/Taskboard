import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUserId } from '@/lib/auth';

const VALID_STATUSES = ['todo', 'in-progress', 'done'];

// Basic XSS sanitization - escapes HTML entities
function sanitize(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;');
}

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
		if (title.trim().length > 200) {
			return NextResponse.json({ error: 'Title too long (max 200 characters)' }, { status: 400 });
		}
		if (!VALID_STATUSES.includes(status)) {
			return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
		}
		const task = await prisma.task.create({
			data: {
				title: sanitize(title.trim()),
				status,
				userId: parseInt(userId, 10),
			},
		});
		return NextResponse.json({ task });
	} catch (err) {
		console.error('[tasks:create]', err instanceof Error ? err.message : err);
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
		console.error('[tasks:list]', err instanceof Error ? err.message : err);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
