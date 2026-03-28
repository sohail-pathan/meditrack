import api from './api'

export const patientService = {
  // Patient
  getProfile:      ()           => api.get('/api/patient/profile'),
  updateProfile:   (data)       => api.put('/api/patient/profile', data),
  getMyRecords:    ()           => api.get('/api/patient/records'),
  uploadRecord:    (form)       => api.post('/api/patient/records/upload', form, {
                                     headers: { 'Content-Type': 'multipart/form-data' }
                                   }),

  // Doctor
  searchPatients:    (name)      => api.get(`/api/doctor/patients/search?name=${encodeURIComponent(name)}`),
  getAllPatients:     ()          => api.get('/api/doctor/patients'),
  getPatient:        (id)        => api.get(`/api/doctor/patients/${id}`),
  getPatientRecords: (id)        => api.get(`/api/doctor/patients/${id}/records`),
  addDoctorNote:     (rid, notes)=> api.put(`/api/doctor/records/${rid}/notes`, { notes }),

  // Emergency
  getEmergency:    (token)      => api.get(`/api/emergency/view/${token}`),
  updateEmergency: (id, data)   => api.put(`/api/emergency/update/${id}`, data),

  // AI
  analyzeSymptoms: (symptoms)   => api.post('/api/ai/symptoms', { symptoms }),
  summarizeReport: (reportText) => api.post('/api/ai/summarize', { reportText }),

  // Admin
  getAdminStats:   ()           => api.get('/api/admin/stats'),
  getAllUsers:      ()           => api.get('/api/admin/users'),
  toggleUser:      (id)         => api.put(`/api/admin/users/${id}/toggle`),
  deleteUser:      (id)         => api.delete(`/api/admin/users/${id}`),
}
