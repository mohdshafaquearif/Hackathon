import { Request, Response } from 'express';
import { User } from '../models/user.model';

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add education
export const addEducation = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { education: req.body } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update education
export const updateEducation = async (req: Request, res: Response) => {
  try {
    const { educationId } = req.params;
    const updates = req.body;

    const user = await User.findOneAndUpdate(
      { 
        _id: req.user._id,
        'education._id': educationId
      },
      { 
        $set: {
          'education.$': updates
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Education entry not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete education
export const deleteEducation = async (req: Request, res: Response) => {
  try {
    const { educationId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { education: { _id: educationId } } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add work experience
export const addWorkExperience = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { workExperience: req.body } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update work experience
export const updateWorkExperience = async (req: Request, res: Response) => {
  try {
    const { experienceId } = req.params;
    const updates = req.body;

    const user = await User.findOneAndUpdate(
      {
        _id: req.user._id,
        'workExperience._id': experienceId
      },
      {
        $set: {
          'workExperience.$': updates
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Work experience entry not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete work experience
export const deleteWorkExperience = async (req: Request, res: Response) => {
  try {
    const { experienceId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { workExperience: { _id: experienceId } } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update settings
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { settings: updates } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 