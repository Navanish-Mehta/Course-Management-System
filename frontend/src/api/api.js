import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

// Courses
export const getCourses = () => axios.get(`${API_BASE}/courses`);
export const getCourse = (courseId) => axios.get(`${API_BASE}/courses/${courseId}`);
export const createCourse = (data) => axios.post(`${API_BASE}/courses`, data);
export const updateCourse = (courseId, data) => axios.put(`${API_BASE}/courses/${courseId}`, data);
export const deleteCourse = (courseId) => axios.delete(`${API_BASE}/courses/${courseId}`);

// Course Instances
export const getInstances = (year, semester) => axios.get(`${API_BASE}/instances/${year}/${semester}`);
export const getInstanceDetails = (year, semester, courseId) => axios.get(`${API_BASE}/instances/${year}/${semester}/${courseId}`);
export const createInstance = (data) => axios.post(`${API_BASE}/instances`, data);
export const deleteInstance = (year, semester, courseId) => axios.delete(`${API_BASE}/instances/${year}/${semester}/${courseId}`); 