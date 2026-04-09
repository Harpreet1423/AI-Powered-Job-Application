import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ApplicationModal({ job, open, onClose, onSuccess }) {
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return 'Please select a file.';
    if (file.type !== 'application/pdf') return 'Only PDF files are allowed.';
    if (file.size > MAX_FILE_SIZE) return 'File size must be less than 5MB.';
    return null;
  };

  const handleFile = (file) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    setResume(file);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setResume(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fileError = validateFile(resume);
    if (fileError) {
      toast.error(fileError);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('jobId', job.id);
      if (coverLetter.trim()) {
        formData.append('coverLetter', coverLetter.trim());
      }

      await api.apply(formData);
      toast.success('Application submitted successfully!');
      setResume(null);
      setCoverLetter('');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply to {job?.title}</DialogTitle>
          <DialogDescription>
            {job?.company} &middot; {job?.location}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Resume Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Resume (PDF) <span className="text-red-500">*</span>
            </label>
            {!resume ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors',
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                )}
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 font-medium">
                  Drag & drop or click to upload
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF only, max 5MB</p>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-3">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">
                    {resume.name}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    ({(resume.size / 1024).toFixed(0)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Cover Letter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Cover Letter{' '}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              placeholder="Tell the employer why you're a great fit..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !resume}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
