import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { CV } from '../types/cv';
import { collection, addDoc, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email?: string;
  };
}

export const createCV = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const cvData: CV = {
      ...req.body,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const cvRef = await addDoc(collection(db, 'cvs'), cvData);
    const cv = await getDoc(cvRef);

    return res.status(201).json({
      id: cv.id,
      ...cv.data()
    });
  } catch (error) {
    console.error('Error creating CV:', error);
    return res.status(500).json({ error: 'Failed to create CV' });
  }
};

export const updateCV = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const cvId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const cvRef = doc(db, 'cvs', cvId);
    const cv = await getDoc(cvRef);

    if (!cv.exists) {
      return res.status(404).json({ error: 'CV not found' });
    }

    const cvData = cv.data() as CV;
    if (cvData.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    await updateDoc(cvRef, updateData);
    
    const updatedCV = await getDoc(cvRef);
    return res.status(200).json({
      id: updatedCV.id,
      ...updatedCV.data()
    });
  } catch (error) {
    console.error('Error updating CV:', error);
    return res.status(500).json({ error: 'Failed to update CV' });
  }
};

export const getCandidateCV = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const cvsRef = collection(db, 'cvs');
    const q = query(cvsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'CV not found' });
    }

    const cvDoc = querySnapshot.docs[0];
    return res.status(200).json({
      id: cvDoc.id,
      ...cvDoc.data()
    });
  } catch (error) {
    console.error('Error getting candidate CV:', error);
    return res.status(500).json({ error: 'Failed to get CV' });
  }
}; 