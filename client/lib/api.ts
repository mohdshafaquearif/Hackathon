import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ProfileData {
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  phone?: string;
  bio?: string;
  preferredLanguages?: string[];
  interestedTopics?: string[];
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  education?: Array<EducationData & { _id?: string }>;
  workExperience?: Array<WorkExperienceData & { _id?: string }>;
}

interface EducationData {
  degree: string;
  college: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
}

interface WorkExperienceData {
  jobTitle: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  employmentType: string;
  industry: string;
  location: string;
}

interface SettingsData {
  theme?: string;
  language?: string;
  emailNotifications?: boolean;
  showProfile?: boolean;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API
export const register = async (userData: RegisterData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials: LoginData) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Profile API
export const updateProfile = async (profileData: ProfileData) => {
  const response = await api.put('/profile', profileData);
  return response.data;
};

// Education API
export const addEducation = async (educationData: EducationData) => {
  const response = await api.post('/profile/education', educationData);
  return response.data;
};

export const updateEducation = async (educationId: string, educationData: EducationData) => {
  const response = await api.put(`/profile/education/${educationId}`, educationData);
  return response.data;
};

export const deleteEducation = async (educationId: string) => {
  const response = await api.delete(`/profile/education/${educationId}`);
  return response.data;
};

// Work Experience API
export const addWorkExperience = async (experienceData: WorkExperienceData) => {
  const response = await api.post('/profile/work-experience', experienceData);
  return response.data;
};

export const updateWorkExperience = async (experienceId: string, experienceData: WorkExperienceData) => {
  const response = await api.put(`/profile/work-experience/${experienceId}`, experienceData);
  return response.data;
};

export const deleteWorkExperience = async (experienceId: string) => {
  const response = await api.delete(`/profile/work-experience/${experienceId}`);
  return response.data;
};

// Settings API
export const updateSettings = async (settingsData: SettingsData) => {
  const response = await api.put('/profile/settings', settingsData);
  return response.data;
}; 