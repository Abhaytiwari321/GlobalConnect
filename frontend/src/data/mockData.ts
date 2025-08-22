import { User, Job, Post, Company } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  title: 'Senior Software Engineer',
  company: 'TechCorp',
  location: 'San Francisco, CA',
  bio: 'Passionate full-stack developer with 8+ years of experience building scalable web applications. Love mentoring junior developers and contributing to open source.',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
  experience: [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      duration: '2021 - Present',
      description: 'Lead development of microservices architecture serving 10M+ users',
      current: true
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      duration: '2019 - 2021',
      description: 'Built and maintained web applications using React and Node.js',
      current: false
    }
  ],
  connections: 847
};

export const mockUsers: User[] = [
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    title: 'Product Manager',
    company: 'InnovateLab',
    location: 'New York, NY',
    bio: 'Product manager with expertise in AI/ML products and user experience design.',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    skills: ['Product Management', 'UX Design', 'Data Analysis', 'Agile'],
    experience: [],
    connections: 652,
    mutualConnections: 23
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'Austin, TX',
    bio: 'Creative UX designer passionate about creating intuitive and beautiful user experiences.',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
    skills: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping'],
    experience: [],
    connections: 423,
    mutualConnections: 15
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david.park@email.com',
    title: 'Data Scientist',
    company: 'DataFlow',
    location: 'Seattle, WA',
    bio: 'Data scientist specializing in machine learning and predictive analytics.',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    experience: [],
    connections: 589,
    mutualConnections: 31
  }
];

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechVision',
    location: 'San Francisco, CA',
    type: 'full-time',
    salary: '$120,000 - $160,000',
    description: 'Join our team to build next-generation web applications using React and TypeScript.',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'Team leadership skills'],
    postedDate: '2024-01-15',
    applicants: 24,
    companyLogo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateCorp',
    location: 'New York, NY',
    type: 'full-time',
    salary: '$140,000 - $180,000',
    description: 'Lead product strategy and development for our flagship SaaS platform.',
    requirements: ['MBA preferred', '7+ years product management', 'B2B SaaS experience'],
    postedDate: '2024-01-14',
    applicants: 18,
    companyLogo: 'https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    title: 'Full Stack Engineer',
    company: 'StartupHub',
    location: 'Remote',
    type: 'remote',
    salary: '$100,000 - $140,000',
    description: 'Build scalable applications using modern technologies in a fast-paced startup environment.',
    requirements: ['Node.js expertise', 'React/Vue.js experience', 'Database design skills'],
    postedDate: '2024-01-13',
    applicants: 31,
    companyLogo: 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    title: 'UX Designer',
    company: 'DesignLab',
    location: 'Los Angeles, CA',
    type: 'contract',
    salary: '$80 - $120/hour',
    description: 'Create beautiful and intuitive user experiences for our mobile and web applications.',
    requirements: ['5+ years UX design', 'Figma expertise', 'Mobile design experience'],
    postedDate: '2024-01-12',
    applicants: 15,
    companyLogo: 'https://images.pexels.com/photos/374016/pexels-photo-374016.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    author: mockUsers[0],
    content: 'Excited to share that our team just launched a new microservices architecture that improved our API response times by 40%! The key was implementing proper caching strategies and optimizing our database queries. #TechLeadership #Performance',
    likes: 47,
    comments: [
      {
        id: '1',
        author: mockUsers[1],
        content: 'Impressive results! Would love to hear more about your caching strategy.',
        timestamp: '2024-01-15T10:30:00Z',
        likes: 3
      }
    ],
    shares: 8,
    timestamp: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    author: mockUsers[1],
    content: 'Just finished an amazing workshop on product discovery techniques. The key takeaway: always validate your assumptions with real user data before building features. #ProductManagement #UserResearch',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    likes: 32,
    comments: [],
    shares: 12,
    timestamp: '2024-01-14T15:45:00Z'
  },
  {
    id: '3',
    author: mockUsers[2],
    content: 'Design tip of the day: When creating user interfaces, remember that white space is not wasted space. It helps users focus on what matters most and creates a cleaner, more professional look. #UXDesign #DesignTips',
    likes: 28,
    comments: [
      {
        id: '2',
        author: mockUsers[3],
        content: 'Great point! White space is often overlooked but so important for readability.',
        timestamp: '2024-01-14T11:20:00Z',
        likes: 2
      }
    ],
    shares: 5,
    timestamp: '2024-01-14T11:00:00Z'
  }
];

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechVision',
    logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
    industry: 'Technology',
    size: '500-1000 employees',
    location: 'San Francisco, CA',
    description: 'Leading technology company focused on innovative web solutions.',
    employees: 750,
    jobOpenings: 12
  },
  {
    id: '2',
    name: 'InnovateCorp',
    logo: 'https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=400',
    industry: 'Software',
    size: '1000+ employees',
    location: 'New York, NY',
    description: 'Enterprise software solutions for modern businesses.',
    employees: 1200,
    jobOpenings: 8
  }
];