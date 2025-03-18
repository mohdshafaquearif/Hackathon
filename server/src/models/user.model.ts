import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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
  education?: Array<{
    degree: string;
    college: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate?: Date;
  }>;
  workExperience?: Array<{
    jobTitle: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    employmentType: string;
    industry: string;
    location: string;
  }>;
  settings?: {
    theme?: string;
    language?: string;
    emailNotifications?: boolean;
    showProfile?: boolean;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  gender: String,
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  phone: String,
  bio: String,
  preferredLanguages: [String],
  interestedTopics: [String],
  socialMedia: {
    linkedin: String,
    twitter: String,
    instagram: String,
    facebook: String,
    youtube: String,
  },
  education: [{
    degree: String,
    college: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
  }],
  workExperience: [{
    jobTitle: String,
    company: String,
    startDate: Date,
    endDate: Date,
    employmentType: String,
    industry: String,
    location: String,
  }],
  settings: {
    theme: { type: String, default: 'light' },
    language: { type: String, default: 'en' },
    emailNotifications: { type: Boolean, default: true },
    showProfile: { type: Boolean, default: true },
  },
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

export const User = mongoose.model<IUser>('User', userSchema); 