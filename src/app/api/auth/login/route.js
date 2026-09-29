import { NextResponse } from 'next/server';
import { createSessionToken } from '@/lib/auth';

// In-memory rate limiting store: IP -> { attempts: number, lockUntil: number }
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const now = Date.now();
    const clientAttempts = loginAttempts.get(ip) || { attempts: 0, lockUntil: 0 };

    // Check if locked out
    if (clientAttempts.lockUntil > now) {
      const remainingMinutes = Math.ceil((clientAttempts.lockUntil - now) / 60000);
      return NextResponse.json(
        { error: `Terlalu banyak percobaan gagal. Silakan coba lagi dalam ${remainingMinutes} menit.` },
        { status: 429 }
      );
    }

    const { username, password } = await request.json();

    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username !== expectedUsername || password !== expectedPassword) {
      const updatedAttempts = clientAttempts.attempts + 1;
      if (updatedAttempts >= MAX_ATTEMPTS) {
        loginAttempts.set(ip, {
          attempts: updatedAttempts,
          lockUntil: now + LOCKOUT_DURATION_MS,
        });
        return NextResponse.json(
          { error: `Akun terkunci sementara karena 5x kesalahan. Coba lagi dalam 15 menit.` },
          { status: 429 }
        );
      } else {
        loginAttempts.set(ip, {
          attempts: updatedAttempts,
          lockUntil: 0,
        });
        const remaining = MAX_ATTEMPTS - updatedAttempts;
        return NextResponse.json(
          { error: `Username atau password salah. (Sisa percobaan: ${remaining})` },
          { status: 401 }
        );
      }
    }

    // Success -> reset attempts
    loginAttempts.delete(ip);

    const token = await createSessionToken(username);
    const response = NextResponse.json({ success: true, message: 'Login berhasil' });

    // Set secure HTTP-only cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}
