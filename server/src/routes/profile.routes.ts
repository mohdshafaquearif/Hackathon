import { Router } from 'express';
import {
  updateProfile,
  addEducation,
  updateEducation,
  deleteEducation,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  updateSettings
} from '../controllers/profile.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Profile routes
router.put('/', protect as any, updateProfile as any);

// Education routes
router.post('/education', protect as any, addEducation as any);
router.put('/education/:educationId', protect as any, updateEducation as any);
router.delete('/education/:educationId', protect as any, deleteEducation as any);

// Work experience routes
router.post('/work-experience', protect as any, addWorkExperience as any);
router.put('/work-experience/:experienceId', protect as any, updateWorkExperience as any);
router.delete('/work-experience/:experienceId', protect as any, deleteWorkExperience as any);

// Settings routes
router.put('/settings', protect as any, updateSettings as any);

export default router; 