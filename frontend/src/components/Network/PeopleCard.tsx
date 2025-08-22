import React from 'react';
import { UserPlus, MessageCircle, MapPin } from 'lucide-react';
import { User } from '../../types';

interface PeopleCardProps {
  user: User;
  onConnect: (userId: string) => void;
  onMessage: (userId: string) => void;
}

const PeopleCard: React.FC<PeopleCardProps> = ({ user, onConnect, onMessage }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Cover Background */}
      <div className="h-20 bg-gradient-to-r from-emerald-400 to-blue-500"></div>
      
      <div className="px-6 pb-6">
        {/* Profile Picture */}
        <div className="flex justify-center -mt-10 mb-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full border-4 border-white object-cover bg-white"
          />
        </div>

        {/* User Info */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-emerald-600 cursor-pointer transition-colors">
            {user.name}
          </h3>
          <p className="text-gray-700 font-medium mb-1">{user.title}</p>
          <p className="text-emerald-600 text-sm mb-2">{user.company}</p>
          
          <div className="flex items-center justify-center space-x-1 text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{user.location}</span>
          </div>

          {user.mutualConnections && user.mutualConnections > 0 && (
            <p className="text-sm text-gray-600 mb-4">
              {user.mutualConnections} mutual connection{user.mutualConnections !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Skills Preview */}
        <div className="mb-4">
          <div className="flex flex-wrap justify-center gap-1">
            {user.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
            {user.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                +{user.skills.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onConnect(user.id)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              user.isConnected
                ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
            disabled={user.isConnected}
          >
            <UserPlus className="w-4 h-4 inline mr-1" />
            {user.isConnected ? 'Connected' : 'Connect'}
          </button>
          
          <button
            onClick={() => onMessage(user.id)}
            className="p-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeopleCard;