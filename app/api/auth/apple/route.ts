import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { SignJWT } from 'jose';

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET env variable is not set');
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req: Request) {
  try {
    const { identityToken, fullName, email } = await req.json();

    if (!identityToken) {
      return NextResponse.json({ error: 'Identity token шаардлагатай' }, { status: 400 });
    }

    const payload = JSON.parse(
      Buffer.from(identityToken.split('.')[1], 'base64url').toString()
    );

    const appleUserId = payload.sub;
    const appleEmail = email || payload.email;

    if (!appleUserId) {
      return NextResponse.json({ error: 'Apple token буруу байна' }, { status: 400 });
    }

    const usersCollection = await getCollection('users');

    let user = await usersCollection.findOne({ appleId: appleUserId }) as any;
    let isNewUser = false;

    if (!user) {
      const name = fullName
        ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim()
        : 'Apple хэрэглэгч';

      const result = await usersCollection.insertOne({
        appleId: appleUserId,
        email: appleEmail || null,
        name: name || 'Apple хэрэглэгч',
        image: null,
        role: 'user',
        provider: 'apple',
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      user = await usersCollection.findOne({ _id: result.insertedId }) as any;
      isNewUser = true;
    }

    const token = await new SignJWT({
      sub: user._id.toString(),
      phone: user.phone || '',
      role: user.role,
      email: user.email,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      isNewUser,
      user: {
        id: user._id.toString(),
        phone: user.phone ?? '',
        email: user.email,
        role: user.role,
        status: user.status,
        name: user.name,
        image: user.image,
      },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Apple auth error:', error);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}
