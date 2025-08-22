import React from 'react';
import { MapPin, Clock, Users, Bookmark, ExternalLink } from 'lucide-react';
import { Job } from '../../types';

interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
  onSave: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, onSave }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'remote':
        return 'bg-green-100 text-green-800';
      case 'contract':
        return 'bg-yellow-100 text-yellow-800';
      case 'part-time':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 p-6">
      {/* Job Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={job.companyLogo}
            alt={job.company}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 hover:text-emerald-600 cursor-pointer transition-colors">
              {job.title}
            </h3>
            <p className="text-lg text-gray-700 font-medium">{job.company}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{job.location}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{formatDate(job.postedDate)}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => onSave(job.id)}
          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Job Details */}
      <div className="mb-4">
        <div className="flex items-center space-x-3 mb-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getTypeColor(job.type)}`}>
            {job.type.replace('-', ' ')}
          </span>
          <span className="text-emerald-600 font-semibold text-lg">{job.salary}</span>
        </div>

        <p className="text-gray-700 leading-relaxed mb-4">{job.description}</p>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Key Requirements:</h4>
          <ul className="space-y-1">
            {job.requirements.map((req, index) => (
              <li key={index} className="flex items-start space-x-2 text-gray-700">
                <span className="text-emerald-500 mt-1.5">•</span>
                <span className="text-sm">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center space-x-1 text-gray-600 mb-4">
          <Users className="w-4 h-4" />
          <span className="text-sm">{job.applicants} applicants</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onApply(job.id)}
          disabled={job.isApplied}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
            job.isApplied
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {job.isApplied ? 'Applied' : 'Apply Now'}
        </button>
        
        <button className="px-4 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors flex items-center space-x-2">
          <ExternalLink className="w-4 h-4" />
          <span className="font-medium">View Details</span>
        </button>
      </div>
    </div>
  );
};

export default JobCard;