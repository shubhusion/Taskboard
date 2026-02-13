import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();
		// Basic validation
		if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
			return NextResponse.json({ error: 'Email and password required.' }, { status: 400 });
		}
		if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
			return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
		}
		if (password.length < 6) {
			return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
		}

		// Check for existing user
		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
		}

		// Hash password and create user
		const hashedPassword = await hashPassword(password);
		await prisma.user.create({ data: { email, passwordHash:hashedPassword } });
		return NextResponse.json({ success: true });
	} catch (err) {
		return NextResponse.json({ error: 'Server error.' }, { status: 500 });
	}
}
