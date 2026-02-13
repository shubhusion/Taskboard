import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUserId } from '@/lib/auth';

const VALID_STATUSES = ['todo', 'in-progress', 'done'];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const taskId = parseInt(id, 10);
		if (isNaN(taskId)) {
			return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
		}
		const userId = await getSessionUserId();
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		const { status } = await req.json();
		if (!VALID_STATUSES.includes(status)) {
			return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
		}
		const task = await prisma.task.findUnique({ where: { id: taskId } });
		if (!task || task.userId !== parseInt(userId, 10)) {
			return NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 });
		}
		const updated = await prisma.task.update({
			where: { id: task.id },
			data: { status },
		});
		return NextResponse.json({ task: updated });
	} catch (err) {
		console.error('[tasks:update]', err instanceof Error ? err.message : err);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
