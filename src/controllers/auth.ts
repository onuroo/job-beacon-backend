import { Request, Response } from 'express';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return res.status(400).json({ error: 'Bu email adresi zaten kayıtlı' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await addDoc(usersRef, {
      email,
      password: hashedPassword,
      role,
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

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(401).json({ error: 'Email veya şifre hatalı' });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email veya şifre hatalı' });
    }

    const token = jwt.sign({ userId: userDoc.id }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.json({ message: 'Başarıyla çıkış yapıldı' });
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
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