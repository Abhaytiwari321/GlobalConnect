import User from '../models/User.js';
import Post from '../models/Post.js';
import Job from '../models/Job.js';
import bcrypt from 'bcryptjs';

export const seedDB = async () => {
  try {
    console.log('🌱 Checking database collections for seeding...');

    // Hash password for seed users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Ensure seed users exist
    const seedEmails = ['michael.chen@email.com', 'emily.rodriguez@email.com', 'david.park@email.com'];
    let seededUsers = [];

    for (const email of seedEmails) {
      let user = await User.findOne({ email });
      if (!user) {
        console.log(`Creating seed user: ${email}`);
        let userData = {
          password: hashedPassword,
          experience: []
        };
        
        if (email === 'michael.chen@email.com') {
          userData = {
            ...userData,
            name: 'Michael Chen',
            email: email,
            title: 'Product Manager',
            company: 'InnovateLab',
            location: 'New York, NY',
            bio: 'Product manager with expertise in AI/ML products and user experience design.',
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
            skills: ['Product Management', 'UX Design', 'Data Analysis', 'Agile'],
            experience: [
              {
                title: 'Product Lead',
                company: 'InnovateLab',
                duration: '2022 - Present',
                description: 'Directing the design and launch of core SaaS components.',
                current: true
              }
            ]
          };
        } else if (email === 'emily.rodriguez@email.com') {
          userData = {
            ...userData,
            name: 'Emily Rodriguez',
            email: email,
            title: 'UX Designer',
            company: 'DesignStudio',
            location: 'Austin, TX',
            bio: 'Creative UX designer passionate about creating intuitive and beautiful user experiences.',
            avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
            skills: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping'],
            experience: [
              {
                title: 'Lead Designer',
                company: 'DesignStudio',
                duration: '2020 - Present',
                description: 'Crafting premium digital platforms.',
                current: true
              }
            ]
          };
        } else if (email === 'david.park@email.com') {
          userData = {
            ...userData,
            name: 'David Park',
            email: email,
            title: 'Data Scientist',
            company: 'DataFlow',
            location: 'Seattle, WA',
            bio: 'Data scientist specializing in machine learning and predictive analytics.',
            avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
            skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
            experience: [
              {
                title: 'AI Researcher',
                company: 'DataFlow',
                duration: '2021 - Present',
                description: 'Building machine learning pipelines.',
                current: true
              }
            ]
          };
        }

        user = await User.create(userData);
      }
      seededUsers.push(user);
    }

    // 2. Ensure seed posts exist
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      console.log('Seeding mock posts...');
      const postsData = [
        {
          author: seededUsers[0]._id,
          content: 'Excited to share that our team just launched a new microservices architecture that improved our API response times by 40%! The key was implementing proper caching strategies and optimizing our database queries. #TechLeadership #Performance',
          likes: [],
          comments: [
            {
              author: seededUsers[1]._id,
              content: 'Impressive results! Would love to hear more about your caching strategy.',
              likes: [],
              createdAt: new Date(Date.now() - 3600000)
            }
          ],
          shareCount: 8,
          isActive: true
        },
        {
          author: seededUsers[1]._id,
          content: 'Just finished an amazing workshop on product discovery techniques. The key takeaway: always validate your assumptions with real user data before building features. #ProductManagement #UserResearch',
          image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
          likes: [],
          comments: [],
          shareCount: 12,
          isActive: true
        }
      ];
      await Post.create(postsData);
      console.log('✅ Mock posts seeded.');
    }

    // 3. Ensure seed jobs exist
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      console.log('Seeding mock jobs...');
      const jobsData = [
        {
          title: 'Senior Frontend Developer',
          company: 'TechVision',
          location: 'San Francisco, CA',
          type: 'full-time',
          experienceLevel: 'senior',
          salary: { min: 120000, max: 160000, currency: 'USD', period: 'yearly' },
          description: 'Join our team to build next-generation web applications using React and TypeScript.',
          requirements: ['5+ years React experience', 'TypeScript proficiency', 'Team leadership skills'],
          responsibilities: ['Architect user interfaces', 'Provide mentorship to junior engineers'],
          benefits: ['Full health cover', 'Equity options'],
          skills: ['React', 'TypeScript', 'TailwindCSS'],
          companyLogo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
          postedBy: seededUsers[0]._id,
          category: 'technology',
          remote: false
        },
        {
          title: 'Product Manager',
          company: 'InnovateCorp',
          location: 'New York, NY',
          type: 'full-time',
          experienceLevel: 'senior',
          salary: { min: 140000, max: 180000, currency: 'USD', period: 'yearly' },
          description: 'Lead product strategy and development for our flagship SaaS platform.',
          requirements: ['MBA preferred', '7+ years product management', 'B2B SaaS experience'],
          responsibilities: ['Formulate platform roadmap', 'Coordinate with cross-functional teams'],
          benefits: ['401k match', 'Flexible vacation'],
          skills: ['Agile', 'Jira', 'B2B'],
          companyLogo: 'https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=400',
          postedBy: seededUsers[0]._id,
          category: 'technology',
          remote: false
        },
        {
          title: 'Full Stack Engineer',
          company: 'StartupHub',
          location: 'Remote',
          type: 'remote',
          experienceLevel: 'mid',
          salary: { min: 100000, max: 140000, currency: 'USD', period: 'yearly' },
          description: 'Build scalable applications using modern technologies in a fast-paced startup environment.',
          requirements: ['Node.js expertise', 'React/Vue.js experience', 'Database design skills'],
          responsibilities: ['Build full stack endpoints', 'Maintain CI/CD builds'],
          benefits: ['100% remote workspace allowance', 'Learning stipend'],
          skills: ['React', 'Node.js', 'MongoDB'],
          companyLogo: 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=400',
          postedBy: seededUsers[1]._id,
          category: 'technology',
          remote: true
        }
      ];
      await Job.create(jobsData);
      console.log('✅ Mock jobs seeded.');
    }

    console.log('🏁 Database checking/seeding complete.');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
};
