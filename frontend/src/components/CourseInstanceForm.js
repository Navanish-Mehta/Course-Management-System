import React, { useState, useEffect } from 'react';
import { getCourses, createInstance } from '../api/api';
import { Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl, Box, Snackbar, Alert, Grid, Paper } from '@mui/material';

const CourseInstanceForm = ({ onCreated }) => {
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [courseId, setCourseId] = useState('');
  const [allCourses, setAllCourses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getCourses().then(res => setAllCourses(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createInstance({ year, semester, courseId });
      setYear(''); setSemester(''); setCourseId('');
      setSuccess(true);
      if (onCreated) onCreated();
    } catch (e) {
      setError(e.response?.data?.error || 'Create failed');
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 6 } }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mb: 2 }}>Create Course Instance</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField label="Year" value={year} onChange={e => setYear(e.target.value)} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Semester" value={semester} onChange={e => setSemester(e.target.value)} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="course-label">Course</InputLabel>
              <Select
                labelId="course-label"
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
                label="Course"
              >
                {allCourses.map(course => (
                  <MenuItem key={course.courseId} value={course.courseId}>
                    {course.title + ' (' + course.courseId + ')'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" sx={{ mt: 1, minWidth: 120 }}>Create</Button>
          </Grid>
        </Grid>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Instance created successfully!
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
};

export default CourseInstanceForm; 