import React from 'react';
import { MapPin, Mail, UserPlus, MessageCircle, MoreHorizontal, Camera } from 'lucide-react';
import { User } from '../../types';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile?: boolean;
  onConnect?: () => void;
  onMessage?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  user, 
  isOwnProfile = true, 
  onConnect, 
  onMessage 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 relative">
        {isOwnProfile && (
          <button className="absolute top-4 right-4 p-2 bg-black bg-opacity-30 text-white rounded-lg hover:bg-opacity-50 transition-colors">
            <Camera className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="px-8 pb-8">
        {/* Profile Picture */}
        <div className="flex items-start justify-between -mt-16 relative">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white"
            />
            {isOwnProfile && (
              <button className="absolute bottom-2 right-2 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          {!isOwnProfile && (
            <div className="flex items-center space-x-3 mt-16">
              <button
                onClick={onConnect}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  user.isConnected
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                <UserPlus className="w-4 h-4 inline mr-2" />
                {user.isConnected ? 'Connected' : 'Connect'}
              </button>
              <button
                onClick={onMessage}
                className="px-6 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Message
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          )}

          {isOwnProfile && (
            <div className="mt-16">
              <button className="px-6 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium">
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
          <p className="text-xl text-gray-700 mb-3">{user.title}</p>
          <p className="text-lg text-emerald-600 font-medium mb-4">{user.company}</p>
          
          <div className="flex items-center space-x-6 text-gray-600 mb-4">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{user.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{user.email}</span>
            </div>
          </div>

          {/* Connections Info */}
          <div className="flex items-center space-x-6 mb-6">
            <div>
              <span className="font-semibold text-gray-900">{user.connections}</span>
              <span className="text-gray-600 ml-1">connections</span>
            </div>
            {user.mutualConnections && (
              <div>
                <span className="font-semibold text-gray-900">{user.mutualConnections}</span>
                <span className="text-gray-600 ml-1">mutual connections</span>
              </div>
            )}
          </div>

          {/* Bio */}
          <p className="text-gray-700 leading-relaxed mb-6">{user.bio}</p>

          {/* Skills */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium hover:bg-emerald-200 transition-colors cursor-pointer"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;