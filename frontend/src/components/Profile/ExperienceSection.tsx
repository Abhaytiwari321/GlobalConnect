import React from 'react';
import { Briefcase, Plus, Edit3 } from 'lucide-react';
import { Experience } from '../../types';

interface ExperienceSectionProps {
  experience: Experience[];
  isOwnProfile?: boolean;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience, isOwnProfile = true }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Briefcase className="w-6 h-6 mr-3 text-emerald-600" />
          Experience
        </h2>
        {isOwnProfile && (
          <button className="flex items-center space-x-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            <span className="font-medium">Add Experience</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {experience.map((exp) => (
          <div key={exp.id} className="relative">
            {/* Timeline dot */}
            <div className="absolute left-0 top-2 w-3 h-3 bg-emerald-600 rounded-full border-2 border-white shadow-md"></div>
            
            <div className="ml-8 pb-6 border-l-2 border-gray-200 last:border-l-0 pl-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{exp.title}</h3>
                  <p className="text-lg text-emerald-600 font-medium mb-2">{exp.company}</p>
                  <p className="text-gray-600 mb-3 flex items-center">
                    <span>{exp.duration}</span>
                    {exp.current && (
                      <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
                
                {isOwnProfile && (
                  <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {experience.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No experience added yet</p>
            {isOwnProfile && (
              <button className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                Add Your First Experience
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceSection;