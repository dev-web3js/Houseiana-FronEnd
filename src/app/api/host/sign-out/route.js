import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Clear the session cookie
    cookieStore.set('houseiana_session', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/'
    });

    return NextResponse.json({
      success: true,
      message: 'Signed out successfully',
      redirectTo: '/host/sign-in'
    });

  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
}