import { decode } from 'jsonwebtoken';

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
    
    const decoded = decode(token) as { userId: string } | null;
    if (!decoded?.userId) return null;

    const user = await prisma.user.findUnique({
        where: {
            id: decoded.userId
        }
    });

    return user;
}