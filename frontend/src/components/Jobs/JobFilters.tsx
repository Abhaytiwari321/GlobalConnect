import React, { useState } from 'react';
import { Filter, MapPin, DollarSign, Clock, Building } from 'lucide-react';

interface JobFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({ onFiltersChange }) => {
  const jobTypes = ['full-time', 'part-time', 'contract', 'remote'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
  const salaryRanges = ['$0-50k', '$50k-100k', '$100k-150k', '$150k+'];

  const [location, setLocation] = useState('');
  const [type, setType] = useState('all');
  const [experienceLevel, setExperienceLevel] = useState('all');
  const [salaryRange, setSalaryRange] = useState('all');

  const handleApply = () => {
    onFiltersChange({
      location,
      type,
      experienceLevel,
      salaryRange,
      remote: type === 'remote'
    });
  };

  const handleClear = () => {
    setLocation('');
    setType('all');
    setExperienceLevel('all');
    setSalaryRange('all');
    onFiltersChange({});
  };

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
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Job Type */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Clock className="w-4 h-4 mr-2 text-emerald-600" />
            Job Type
          </label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {jobTypes.map((t) => (
              <option key={t} value={t}>{t.replace('-', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Building className="w-4 h-4 mr-2 text-emerald-600" />
            Experience Level
          </label>
          <select 
            value={experienceLevel} 
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Salary Range */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <DollarSign className="w-4 h-4 mr-2 text-emerald-600" />
            Salary Range
          </label>
          <select 
            value={salaryRange} 
            onChange={(e) => setSalaryRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">All Ranges</option>
            {salaryRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        {/* Apply Filters Button */}
        <button onClick={handleApply} className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
          Apply Filters
        </button>

        {/* Clear Filters */}
        <button onClick={handleClear} className="w-full py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium">
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default JobFilters;