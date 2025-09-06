import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() }
    });
    
    if (existingUser) {
      return Response.json({ 
        error: 'Email already registered' 
      }, { status: 400 });
    }
    
    // Create host account
    const hashedPassword = await hashPassword(body.password);
    
    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        passwordHash: hashedPassword,
        firstName: body.firstName,
        lastName: body.lastName,
        name: `${body.firstName} ${body.lastName}`,
        phone: body.phone,
        role: 'host',
        isHost: true,
        
        // Host-specific fields
        governmentIdType: body.idType,
        governmentId: body.idNumber, // Should be encrypted in production
        bankName: body.bankName,
        accountNumber: body.accountNumber, // Should be encrypted
        iban: body.iban, // Should be encrypted
        
        hostVerified: 'pending'
      }
    });
    
    // Send verification email (implement with your email service)
    // await sendVerificationEmail(user.email);
    
    return Response.json({
      success: true,
      message: 'Host account created successfully',
      userId: user.id
    }, { status: 201 });
    
  } catch (error) {
    console.error('Host registration error:', error);
    return Response.json({ 
      error: 'Registration failed' 
    }, { status: 500 });
  }
}