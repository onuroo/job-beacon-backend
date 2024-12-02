import { Request, Response } from 'express';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types/user';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '24h';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email?: string;
  };
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Geçerli bir email adresi giriniz' });
    }

    if (!role || !Object.values(UserRole).includes(role)) {
      return res.status(400).json({ 
        error: 'Geçerli bir rol seçiniz',
        validRoles: Object.values(UserRole)
      });
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const usersRef = collection(db, 'users');
    await addDoc(usersRef, {
      email,
      role,
      firebaseUid: firebaseUser.uid,
      createdAt: new Date()
    });

    res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu' });
  } catch (error: any) {
    console.error('Create User Error:', error);
    res.status(500).json({ 
      error: 'Bir hata oluştu', 
      details: error.message
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(401).json({ error: 'Email veya şifre hatalı' });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    const token = jwt.sign({ userId: userDoc.id }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });

    res.json({ 
      token,
      expiresIn: TOKEN_EXPIRY,
      user: {
        id: userDoc.id,
        email: userData.email,
        role: userData.role
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Giriş yapılırken bir hata oluştu' });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.json({ message: 'Başarıyla çıkış yapıldı' });
};

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.user || {};
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const usersRef = collection(db, 'users');
    const userDoc = await getDocs(query(usersRef, where('__name__', '==', userId)));

    if (userDoc.empty) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const userData = userDoc.docs[0].data();
    
    res.json({
      id: userId,
      email: userData.email,
      role: userData.role,
      createdAt: userData.createdAt
    });
  } catch (error: any) {
    console.error('Get User Error:', error);
    res.status(500).json({ 
      error: 'Bir hata oluştu', 
      details: error.message 
    });
  }
}; 