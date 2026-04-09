const BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    credentials: 'include',
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    ...options,
    body: options.body instanceof FormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

export const api = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  login: (data) => request('/auth/login', { method: 'POST', body: data }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),

  // Users
  updateProfile: (data) => request('/users/profile', { method: 'PUT', body: data }),
  changePassword: (data) => request('/users/password', { method: 'PUT', body: data }),

  // Jobs
  getJobs: (params) => {
    const query = new URLSearchParams(params).toString();
    return request(`/jobs?${query}`);
  },
  getJob: (id) => request(`/jobs/${id}`),
  createJob: (data) => request('/jobs', { method: 'POST', body: data }),
  updateJob: (id, data) => request(`/jobs/${id}`, { method: 'PUT', body: data }),
  deleteJob: (id) => request(`/jobs/${id}`, { method: 'DELETE' }),
  getMyJobs: () => request('/jobs/recruiter/my-jobs'),
  saveJob: (id) => request(`/jobs/${id}/save`, { method: 'POST' }),
  getSavedJobs: () => request('/jobs/seeker/saved'),

  // Applications
  apply: (formData) => request('/applications', { method: 'POST', body: formData }),
  getMyApplications: () => request('/applications/my-applications'),
  getJobApplications: (jobId) => request(`/applications/job/${jobId}`),
  updateApplicationStatus: (id, status) => request(`/applications/${id}/status`, { method: 'PUT', body: { status } }),

  // AI
  analyzeResume: (formData) =>
    fetch(`${BASE}/ai/analyze-resume`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      return data;
    }),
  getAnalyses: () => request('/ai/analyses'),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminUsers: () => request('/admin/users'),
  getAdminJobs: () => request('/admin/jobs'),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  deleteAdminJob: (id) => request(`/admin/jobs/${id}`, { method: 'DELETE' }),
};
