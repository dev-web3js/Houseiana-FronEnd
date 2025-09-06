import { cookies } from 'next/headers';
import prisma from './prisma';

export async function getServerSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('houseiana_session');
    
    if (!sessionToken || !sessionToken.value) {
      return null;
    }

    // Get session from database
    const session = await prisma.session.findUnique({
      where: {
        token: sessionToken.value
      },
      include: {
        user: true
      }
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    // Update last activity
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActivity: new Date() }
    });

    return {
      userId: session.userId,
      user: session.user,
      isHost: session.user.isHost,
      role: session.user.role
    };
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}