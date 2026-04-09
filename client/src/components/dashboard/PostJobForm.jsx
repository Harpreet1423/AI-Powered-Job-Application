import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, X, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const initialFormState = {
  title: '',
  company: '',
  location: '',
  type: '',
  salaryMin: '',
  salaryMax: '',
  description: '',
  skills: [],
  deadline: '',
};

export default function PostJobForm({ onSuccess }) {
  const [form, setForm] = useState(initialFormState);
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const addSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const skill = skillInput.trim();
      if (skill && !form.skills.includes(skill)) {
        setForm((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.company.trim()) newErrors.company = 'Company is required';
    if (!form.location) newErrors.location = 'Location is required';
    if (!form.type) newErrors.type = 'Job type is required';
    if (form.description.trim().length < 50)
      newErrors.description = 'Description must be at least 50 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location,
        type: form.type,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        description: form.description.trim(),
        skills: form.skills.join(', '),
        deadline: form.deadline || undefined,
      };

      await api.createJob(payload);
      toast.success('Job posted successfully!');
      setForm(initialFormState);
      setSkillInput('');
      setErrors({});
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Post a New Job
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Senior React Developer"
                  value={form.title}
                  onChange={handleChange}
                  className={cn(errors.title && 'border-red-500')}
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="e.g. Acme Corp"
                  value={form.company}
                  onChange={handleChange}
                  className={cn(errors.company && 'border-red-500')}
                />
                {errors.company && (
                  <p className="text-xs text-red-500">{errors.company}</p>
                )}
              </div>
            </div>

            {/* Location & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location *</Label>
                <Select
                  value={form.location}
                  onValueChange={(val) => handleSelectChange('location', val)}
                >
                  <SelectTrigger
                    className={cn(errors.location && 'border-red-500')}
                  >
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Onsite">Onsite</SelectItem>
                  </SelectContent>
                </Select>
                {errors.location && (
                  <p className="text-xs text-red-500">{errors.location}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Job Type *</Label>
                <Select
                  value={form.type}
                  onValueChange={(val) => handleSelectChange('type', val)}
                >
                  <SelectTrigger
                    className={cn(errors.type && 'border-red-500')}
                  >
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-xs text-red-500">{errors.type}</p>
                )}
              </div>
            </div>

            {/* Salary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Salary Min</Label>
                <Input
                  id="salaryMin"
                  name="salaryMin"
                  type="number"
                  placeholder="e.g. 50000"
                  value={form.salaryMin}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMax">Salary Max</Label>
                <Input
                  id="salaryMax"
                  name="salaryMax"
                  type="number"
                  placeholder="e.g. 80000"
                  value={form.salaryMax}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Describe the role, responsibilities, and requirements (min 50 characters)..."
                value={form.description}
                onChange={handleChange}
                className={cn(
                  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  errors.description && 'border-red-500'
                )}
              />
              <div className="flex justify-between">
                {errors.description ? (
                  <p className="text-xs text-red-500">{errors.description}</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-muted-foreground">
                  {form.description.length}/50 min
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
              />
              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline">Application Deadline</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>

            {/* Submit */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Posting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Post Job
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
