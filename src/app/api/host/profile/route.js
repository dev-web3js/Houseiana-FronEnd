import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('houseiana_session');

    console.log('Session token exists:', !!sessionToken); // Debug log

    if (!sessionToken || !sessionToken.value) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Decode the session token
    let sessionData;
    try {
      sessionData = JSON.parse(
        Buffer.from(sessionToken.value, 'base64').toString()
      );
      console.log('Session data decoded:', sessionData); // Debug log
    } catch (e) {
      console.error('Failed to decode session:', e);
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Return the user data from session
    return NextResponse.json({
      id: sessionData.id || '',
      email: sessionData.email || '',
      firstName: sessionData.firstName || 'Host',
      lastName: sessionData.lastName || '',
      role: sessionData.role || 'host',
      success: true
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}