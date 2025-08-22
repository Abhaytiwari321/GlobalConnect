import express from 'express';
import Job from '../models/Job.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs with filters
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      location,
      type,
      experienceLevel,
      minSalary,
      maxSalary,
      search,
      category,
      remote,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter object
    const filter = { isActive: true };

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (type) {
      filter.type = type;
    }

    if (experienceLevel) {
      filter.experienceLevel = experienceLevel;
    }

    if (category) {
      filter.category = category;
    }

    if (remote === 'true') {
      filter.remote = true;
    }

    if (minSalary || maxSalary) {
      filter['salary.min'] = {};
      if (minSalary) filter['salary.min'].$gte = parseInt(minSalary);
      if (maxSalary) filter['salary.max'] = { $lte: parseInt(maxSalary) };
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(filter);

    const jobsWithApplicationStatus = jobs.map(job => {
      const hasApplied = job.applicants.some(
        applicant => applicant.user.toString() === req.user._id.toString()
      );

      return {
        id: job._id,
        title: job.title,
        company: job.company,
        companyLogo: job.companyLogo,
        location: job.location,
        type: job.type,
        experienceLevel: job.experienceLevel,
        salary: job.salary,
        description: job.description,
        requirements: job.requirements,
        responsibilities: job.responsibilities,
        benefits: job.benefits,
        skills: job.skills,
        postedDate: job.createdAt,
        applicants: job.applicantCount,
        isApplied: hasApplied,
        remote: job.remote,
        category: job.category,
      };
    });

    res.json({
      jobs: jobsWithApplicationStatus,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      },
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name company avatar')
      .populate('applicants.user', 'name title avatar');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const hasApplied = job.applicants.some(
      applicant => applicant.user._id.toString() === req.user._id.toString()
    );

    res.json({
      id: job._id,
      title: job.title,
      company: job.company,
      companyLogo: job.companyLogo,
      location: job.location,
      type: job.type,
      experienceLevel: job.experienceLevel,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      benefits: job.benefits,
      skills: job.skills,
      postedBy: job.postedBy,
      postedDate: job.createdAt,
      applicants: job.applicantCount,
      isApplied: hasApplied,
      remote: job.remote,
      category: job.category,
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs
// @desc    Create a job
// @access  Private
router.post('/', auth, upload.single('companyLogo'), async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      experienceLevel,
      salary,
      description,
      requirements,
      responsibilities,
      benefits,
      skills,
      remote,
      category,
    } = req.body;

    const jobData = {
      title,
      company,
      location,
      type,
      experienceLevel,
      salary: JSON.parse(salary || '{}'),
      description,
      requirements: JSON.parse(requirements || '[]'),
      responsibilities: JSON.parse(responsibilities || '[]'),
      benefits: JSON.parse(benefits || '[]'),
      skills: JSON.parse(skills || '[]'),
      postedBy: req.user._id,
      remote: remote === 'true',
      category,
    };

    if (req.file) {
      jobData.companyLogo = req.file.path;
    }

    const job = new Job(jobData);
    await job.save();

    res.status(201).json({
      id: job._id,
      title: job.title,
      company: job.company,
      companyLogo: job.companyLogo,
      location: job.location,
      type: job.type,
      experienceLevel: job.experienceLevel,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements,
      postedDate: job.createdAt,
      applicants: 0,
      isApplied: false,
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs/:id/apply
// @desc    Apply to a job
// @access  Private
router.post('/:id/apply', auth, upload.single('resume'), async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const hasApplied = job.applicants.some(
      applicant => applicant.user.toString() === req.user._id.toString()
    );

    if (hasApplied) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    const applicationData = {
      user: req.user._id,
      coverLetter,
    };

    if (req.file) {
      applicationData.resume = req.file.path;
    }

    job.applicants.push(applicationData);
    await job.save();

    // Add to user's applied jobs
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        appliedJobs: {
          job: job._id,
        },
      },
    });

    res.json({
      message: 'Application submitted successfully',
      applicants: job.applicantCount,
    });
  } catch (error) {
    console.error('Apply job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs/:id/save
// @desc    Save/unsave a job
// @access  Private
router.post('/:id/save', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.id;

    const isSaved = user.savedJobs.includes(jobId);

    if (isSaved) {
      // Unsave
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    } else {
      // Save
      user.savedJobs.push(jobId);
    }

    await user.save();

    res.json({
      message: isSaved ? 'Job unsaved' : 'Job saved',
      isSaved: !isSaved,
    });
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
