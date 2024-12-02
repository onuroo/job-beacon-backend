export interface CV {
  id?: string;
  userId: string;
  title: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
  };
  education?: {
    schoolName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
  }[];
  experience?: {
    companyName: string;
    position: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }[];
  skills?: string[];
  createdAt: Date;
  updatedAt: Date;
} 