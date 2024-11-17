import { decode } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export const getUser = () => {
  'use client';
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && token) {
      return {
        user: JSON.parse(user),
        token
      };
    }
  }
  return null;
};

export const getUserFromToken = async (request: Request) => {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;
  
  try {
    const decoded = decode(token) as { userId: string } | null;
    if (!decoded?.userId) return null;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId
      }
    });

    return user;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// This is the main auth function used in API routes
export async function auth(request: Request) {
  const user = await getUserFromToken(request);
  return user;
}