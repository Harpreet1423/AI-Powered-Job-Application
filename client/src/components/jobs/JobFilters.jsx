import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

const locationOptions = ['All', 'Remote', 'Hybrid', 'Onsite'];
const typeOptions = ['All', 'Full-time', 'Part-time', 'Contract'];

export default function JobFilters({ filters, onFilterChange }) {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      location: '',
      type: '',
      salaryMin: '',
      salaryMax: '',
      skills: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '' && v != null);

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm space-y-6">
      {/* Search */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
          Search
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Job title, company, keywords..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
          Location
        </Label>
        <div className="flex flex-wrap gap-2">
          {locationOptions.map((option) => {
            const value = option === 'All' ? '' : option.toLowerCase();
            const isActive =
              (option === 'All' && !filters.location) ||
              filters.location === value;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleChange('location', value)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium border transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Type */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
          Job Type
        </Label>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((option) => {
            const value = option === 'All' ? '' : option.toLowerCase();
            const isActive =
              (option === 'All' && !filters.type) ||
              filters.type === value;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleChange('type', value)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium border transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Salary Range */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
          Salary Range
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.salaryMin || ''}
            onChange={(e) => handleChange('salaryMin', e.target.value)}
            className="flex-1"
          />
          <span className="text-gray-400 text-sm">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.salaryMax || ''}
            onChange={(e) => handleChange('salaryMax', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
          Skills
        </Label>
        <Input
          placeholder="e.g. React, Node.js"
          value={filters.skills || ''}
          onChange={(e) => handleChange('skills', e.target.value)}
        />
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full gap-2 text-gray-600"
        >
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
