import { NextResponse } from 'next/server';

export function middleware(req: Request) {
	// Example: allow all requests (minimal placeholder)
	return NextResponse.next();
}
