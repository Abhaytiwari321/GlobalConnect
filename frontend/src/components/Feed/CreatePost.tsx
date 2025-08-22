import React, { useState } from 'react';
import { Image, Video, Calendar, TrendingUp, X } from 'lucide-react';

interface CreatePostProps {
  user: any;
  onCreatePost: (content: string, image?: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ user, onCreatePost }) => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      onCreatePost(content, selectedImage || undefined);
      setContent('');
      setSelectedImage(null);
      setIsExpanded(false);
    }
  };

  const addImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setSelectedImage(url);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-start space-x-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
        />
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Share your professional insights..."
            className="w-full resize-none border-none outline-none text-gray-800 placeholder-gray-500 text-lg"
            rows={isExpanded ? 4 : 1}
          />

          {selectedImage && (
            <div className="mt-4 relative">
              <img
                src={selectedImage}
                alt="Selected"
                className="max-h-64 rounded-lg object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {isExpanded && (
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={addImageUrl}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Image className="w-5 h-5" />
                    <span className="text-sm font-medium">Photo</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Video className="w-5 h-5" />
                    <span className="text-sm font-medium">Video</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-medium">Event</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-medium">Poll</span>
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      setContent('');
                      setSelectedImage(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!content.trim()}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;