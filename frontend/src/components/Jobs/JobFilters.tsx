import React from 'react';
import { Filter, MapPin, DollarSign, Clock, Building } from 'lucide-react';

interface JobFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({ onFiltersChange }) => {
  const jobTypes = ['full-time', 'part-time', 'contract', 'remote'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
  const salaryRanges = ['$0-50k', '$50k-100k', '$100k-150k', '$150k+'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center mb-6">
        <Filter className="w-5 h-5 text-emerald-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
      </div>

      <div className="space-y-6">
        {/* Location */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
            Location
          </label>
          <input
            type="text"
            placeholder="Enter city or remote"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Job Type */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Clock className="w-4 h-4 mr-2 text-emerald-600" />
            Job Type
          </label>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {type.replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Building className="w-4 h-4 mr-2 text-emerald-600" />
            Experience Level
          </label>
          <div className="space-y-2">
            {experienceLevels.map((level) => (
              <label key={level} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <DollarSign className="w-4 h-4 mr-2 text-emerald-600" />
            Salary Range
          </label>
          <div className="space-y-2">
            {salaryRanges.map((range) => (
              <label key={range} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">{range}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Filters Button */}
        <button className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
          Apply Filters
        </button>

        {/* Clear Filters */}
        <button className="w-full py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium">
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default JobFilters;