import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}


const SESSION_COOKIE = 'session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days


export async function createSession(userId: string, response: any) {
   
    response.cookies.set(SESSION_COOKIE, userId, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: SESSION_MAX_AGE,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
    });
}

export async function getSessionUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    const value = cookieStore.get(SESSION_COOKIE)?.value;
    return value || null;
}

export async function destroySession(response: any) {
    response.cookies.delete(SESSION_COOKIE);
}