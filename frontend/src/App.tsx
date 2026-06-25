import React, { useState, useEffect } from 'react';
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
import { postsAPI, jobsAPI, usersAPI, authAPI } from './services/api';
import ChatWindow from './components/Messages/ChatWindow';
import AiAssistant from './components/AiAssistant/AiAssistant';
import Settings from './components/Settings/Settings';
import HelpCenter from './components/HelpCenter/HelpCenter';

const AppContent: React.FC = () => {
  const { user, loading, updateUser } = useAuth();
  const [currentView, setCurrentView] = useState('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch data from backend on user login/mount
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setLoadingData(true);
      try {
        const postsRes = await postsAPI.getPosts();
        setPosts(postsRes.posts || []);
      } catch (err) {
        console.error('Failed to load posts from API, using mock data:', err);
        setPosts(mockPosts);
      }

      try {
        const jobsRes = await jobsAPI.getJobs();
        setJobs(jobsRes.jobs || []);
      } catch (err) {
        console.error('Failed to load jobs from API, using mock data:', err);
        setJobs(mockJobs);
      }

      try {
        const usersRes = await usersAPI.getUsers();
        setUsers(usersRes.users || []);
      } catch (err) {
        console.error('Failed to load users from API, using mock data:', err);
        setUsers(mockUsers);
      }
      setLoadingData(false);
    };

    loadData();
  }, [user]);

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

  const handleCreatePost = async (content: string, image?: string) => {
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }
      const response = await postsAPI.createPost(formData);
      setPosts([response, ...posts]);
    } catch (err) {
      console.error('Failed to create post on API, adding locally:', err);
      // Fallback
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
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const response = await postsAPI.likePost(postId);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: response.likes, isLiked: response.isLiked }
          : post
      ));
    } catch (err) {
      console.error('Failed to like post on API, toggling locally:', err);
      // Fallback
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + (post.isLiked ? -1 : 1), isLiked: !post.isLiked }
          : post
      ));
    }
  };

  const handleCommentPost = async (postId: string, content: string) => {
    try {
      const response = await postsAPI.commentPost(postId, content);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              comments: [...post.comments, response]
            }
          : post
      ));
    } catch (err) {
      console.error('Failed to comment on post on API, adding locally:', err);
      // Fallback
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
    }
  };

  const handleApplyJob = async (jobId: string) => {
    try {
      const formData = new FormData();
      formData.append('coverLetter', 'Applied via ConnectPro');
      const response = await jobsAPI.applyJob(jobId, formData);
      setJobs(jobs.map(job => 
        job.id === jobId 
          ? { ...job, isApplied: true, applicants: response.applicants }
          : job
      ));
    } catch (err) {
      console.error('Failed to apply for job on API, applying locally:', err);
      // Fallback
      setJobs(jobs.map(job => 
        job.id === jobId 
          ? { ...job, isApplied: true, applicants: job.applicants + 1 }
          : job
      ));
    }
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      const response = await jobsAPI.saveJob(jobId);
      alert(response.message || 'Job saved successfully!');
    } catch (err) {
      console.error('Failed to save job:', err);
      alert('Failed to save job');
    }
  };

  const handleConnect = async (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    const isIncoming = targetUser?.hasIncoming;

    try {
      if (isIncoming) {
        await usersAPI.acceptConnectionRequest(userId);
        setUsers(users.map(u => 
          u.id === userId 
            ? { ...u, isConnected: true, isPending: false, hasIncoming: false }
            : u
        ));
      } else {
        await usersAPI.connectUser(userId);
        setUsers(users.map(u => 
          u.id === userId 
            ? { ...u, isPending: true }
            : u
        ));
      }
    } catch (err) {
      console.error('Failed to connect on API, toggling locally:', err);
      // Fallback
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, isConnected: !isIncoming, isPending: !isIncoming }
          : u
      ));
    }
  };

  const handleMessage = (userId: string) => {
    console.log('Message user:', userId);
    setCurrentView('messages');
  };

  const handleUploadAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('name', user.name);
      formData.append('title', user.title || '');
      formData.append('company', user.company || '');
      formData.append('location', user.location || '');
      formData.append('bio', user.bio || '');
      formData.append('skills', JSON.stringify(user.skills || []));
      formData.append('experience', JSON.stringify(user.experience || []));

      const response = await authAPI.updateProfile(formData);
      updateUser(response);
      alert('Profile photo updated successfully!');
    } catch (err: any) {
      console.error('Failed to upload avatar:', err);
      alert(`Failed to upload avatar: ${err?.message || 'Unknown error'}`);
    }
  };

  const handleAddExperience = async (newExp: any) => {
    try {
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('title', user.title || '');
      formData.append('company', user.company || '');
      formData.append('location', user.location || '');
      formData.append('bio', user.bio || '');
      formData.append('skills', JSON.stringify(user.skills || []));
      
      const updatedExperience = [...(user.experience || []), { ...newExp, id: Date.now().toString() }];
      formData.append('experience', JSON.stringify(updatedExperience));

      const response = await authAPI.updateProfile(formData);
      updateUser(response);
      alert('Experience added successfully!');
    } catch (err: any) {
      console.error('Failed to add experience:', err);
      alert(`Failed to add experience: ${err?.message || 'Unknown error'}`);
    }
  };

  const handleEditProfile = async (updatedData: any) => {
    try {
      const formData = new FormData();
      formData.append('name', updatedData.name);
      formData.append('title', updatedData.title || '');
      formData.append('company', updatedData.company || '');
      formData.append('location', updatedData.location || '');
      formData.append('bio', updatedData.bio || '');
      formData.append('skills', JSON.stringify(updatedData.skills || []));
      formData.append('experience', JSON.stringify(user.experience || []));

      const response = await authAPI.updateProfile(formData);
      updateUser(response);
      alert('Profile updated successfully!');
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      alert(`Failed to update profile: ${err?.message || 'Unknown error'}`);
    }
  };

  const handleFiltersChange = async (filters: any) => {
    try {
      const params: any = {};
      if (filters.search) params.search = filters.search;
      if (filters.location) params.location = filters.location;
      if (filters.type && filters.type !== 'all') params.type = filters.type;
      if (filters.experienceLevel && filters.experienceLevel !== 'all') params.experienceLevel = filters.experienceLevel;
      if (filters.remote) params.remote = 'true';
      if (filters.salaryRange && filters.salaryRange !== 'all') {
        if (filters.salaryRange === '$0-50k') { params.minSalary = 0; params.maxSalary = 50000; }
        else if (filters.salaryRange === '$50k-100k') { params.minSalary = 50000; params.maxSalary = 100000; }
        else if (filters.salaryRange === '$100k-150k') { params.minSalary = 100000; params.maxSalary = 150000; }
        else if (filters.salaryRange === '$150k+') { params.minSalary = 150000; }
      }
      
      const jobsRes = await jobsAPI.getJobs(params);
      setJobs(jobsRes.jobs || []);
    } catch (err) {
      console.error('Failed to fetch filtered jobs from API:', err);
    }
  };

  // Local Search filtering
  const filteredPosts = posts.filter(post => 
    post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFeed = () => (
    <div className="max-w-2xl mx-auto">
      <CreatePost user={user} onCreatePost={handleCreatePost} />
      {loadingData && posts.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Loading posts...</p>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLikePost}
              onComment={handleCommentPost}
            />
          ))}
          {filteredPosts.length === 0 && (
            <p className="text-center text-gray-500 py-8">No posts found</p>
          )}
        </div>
      )}
    </div>
  );

  const renderJobs = () => (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <JobFilters onFiltersChange={handleFiltersChange} />
      </div>
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
          <p className="text-gray-600">Discover your next career move with {filteredJobs.length} available positions</p>
        </div>
        {loadingData && jobs.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Loading jobs...</p>
        ) : (
          <>
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={handleApplyJob}
                onSave={handleSaveJob}
              />
            ))}
            {filteredJobs.length === 0 && (
              <p className="text-center text-gray-500 py-8">No jobs found</p>
            )}
          </>
        )}
      </div>
    </div>
  );

  const renderNetwork = () => (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Grow Your Network</h1>
        <p className="text-gray-600">Connect with professionals in your industry and expand your opportunities</p>
      </div>
      {loadingData && users.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Loading connections...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <PeopleCard
                key={user.id}
                user={user}
                onConnect={handleConnect}
                onMessage={handleMessage}
              />
            ))}
          </div>
          {filteredUsers.length === 0 && (
            <p className="text-center text-gray-500 py-8">No professionals found</p>
          )}
        </>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProfileHeader user={user} onUploadAvatar={handleUploadAvatar} onEditProfile={handleEditProfile} />
      <ExperienceSection experience={user.experience || []} onAddExperience={handleAddExperience} />
    </div>
  );

  const renderMessages = () => (
    <div className="max-w-6xl mx-auto">
      <ChatWindow currentUser={user} users={users} />
    </div>
  );

  const renderAiAssistant = () => (
    <div className="max-w-6xl mx-auto">
      <AiAssistant user={user} />
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
      case 'ai-assistant':
        return renderAiAssistant();
      case 'settings':
        return <div className="max-w-6xl mx-auto"><Settings /></div>;
      case 'help':
        return <div className="max-w-6xl mx-auto"><HelpCenter /></div>;
      default:
        return renderFeed();
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white dark-mode-override' : 'bg-gray-50'}`}>
      <Navbar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      <main className="pt-8 pb-24 sm:pb-8 px-4 sm:px-6 lg:px-8">
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