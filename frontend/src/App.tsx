import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './components/Auth/AuthPage';
import Navbar from './components/Layout/Navbar';
import PostCard from './components/Feed/PostCard';
import CreatePost from './components/Feed/CreatePost';
import JobCard from './components/Jobs/JobCard';
import JobFilters from './components/Jobs/JobFilters';
import ProfileHeader from './components/Profile/ProfileHeader';
import ExperienceSection from './components/Profile/ExperienceSection';
import PeopleCard from './components/Network/PeopleCard';
import { mockUser, mockUsers, mockJobs, mockPosts } from './data/mockData';
import { Post } from './types';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('feed');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [jobs, setJobs] = useState(mockJobs);
  const [users, setUsers] = useState(mockUsers);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <p className="text-gray-600">Loading ConnectPro...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleCreatePost = (content: string, image?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: user,
      content,
      image,
      likes: 0,
      comments: [],
      shares: 0,
      timestamp: new Date().toISOString()
    };
    setPosts([newPost, ...posts]);
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + (post.isLiked ? -1 : 1), isLiked: !post.isLiked }
        : post
    ));
  };

  const handleCommentPost = (postId: string, content: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            comments: [...post.comments, {
              id: Date.now().toString(),
              author: user,
              content,
              timestamp: new Date().toISOString(),
              likes: 0
            }]
          }
        : post
    ));
  };

  const handleApplyJob = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId 
        ? { ...job, isApplied: true, applicants: job.applicants + 1 }
        : job
    ));
  };

  const handleSaveJob = (jobId: string) => {
    console.log('Save job:', jobId);
  };

  const handleConnect = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isConnected: true }
        : user
    ));
  };

  const handleMessage = (userId: string) => {
    console.log('Message user:', userId);
  };

  const renderFeed = () => (
    <div className="max-w-2xl mx-auto">
      <CreatePost user={user} onCreatePost={handleCreatePost} />
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLikePost}
            onComment={handleCommentPost}
          />
        ))}
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <JobFilters onFiltersChange={(filters) => console.log(filters)} />
      </div>
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
          <p className="text-gray-600">Discover your next career move with {jobs.length} available positions</p>
        </div>
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onApply={handleApplyJob}
            onSave={handleSaveJob}
          />
        ))}
      </div>
    </div>
  );

  const renderNetwork = () => (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Grow Your Network</h1>
        <p className="text-gray-600">Connect with professionals in your industry and expand your opportunities</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <PeopleCard
            key={user.id}
            user={user}
            onConnect={handleConnect}
            onMessage={handleMessage}
          />
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProfileHeader user={user} />
      <ExperienceSection experience={user.experience} />
    </div>
  );

  const renderMessages = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
        <p className="text-gray-600 mb-6">Stay connected with your professional network</p>
        <div className="bg-gray-50 rounded-lg p-12">
          <p className="text-gray-500">Message functionality coming soon...</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'feed':
        return renderFeed();
      case 'jobs':
        return renderJobs();
      case 'network':
        return renderNetwork();
      case 'profile':
        return renderProfile();
      case 'messages':
        return renderMessages();
      default:
        return renderFeed();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        user={user}
      />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;