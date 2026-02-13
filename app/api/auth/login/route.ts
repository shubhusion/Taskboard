import { NextResponse } from 'next/server';
import {prisma} from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();
		// Basic validation
		if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
			return NextResponse.json({ error: 'Email and password required.' }, { status: 400 });
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
		}

		const valid = await verifyPassword(password, user.passwordHash);
		if (!valid) {
			return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
		}

		const response = NextResponse.json({ success: true });
		await createSession(String(user.id), response);
		return response;
	} catch (err) {
		console.error('[login]', err instanceof Error ? err.message : err);
		return NextResponse.json({ error: 'Server error.' }, { status: 500 });
	}
}
