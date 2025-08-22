export interface User {
  id: string;
  name: string;
  email: string;
  title: string;
  company: string;
  location: string;
  bio: string;
  avatar: string;
  skills: string[];
  experience: Experience[];
  connections: number;
  isConnected?: boolean;
  mutualConnections?: number;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  current: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  applicants: number;
  companyLogo: string;
  isApplied?: boolean;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  shares: number;
  timestamp: string;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  likes: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  employees: number;
  jobOpenings: number;
}