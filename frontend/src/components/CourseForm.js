import React, { useState, useEffect } from 'react';
import { getCourses, createCourse, updateCourse } from '../api/api';
import { Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl, OutlinedInput, Checkbox, ListItemText, Box, Snackbar, Alert, Grid, Paper } from '@mui/material';

const CourseForm = ({ onSuccess, editingCourse, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [description, setDescription] = useState('');
  const [prerequisites, setPrerequisites] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isEditMode = Boolean(editingCourse);

  useEffect(() => {
    getCourses().then(res => {
      // Exclude the course being edited from the prerequisites list
      const filteredCourses = isEditMode ? res.data.filter(c => c.id !== editingCourse.id) : res.data;
      setAllCourses(filteredCourses);
    });

    if (isEditMode) {
      setTitle(editingCourse.title);
      setCourseId(editingCourse.courseId);
      setDescription(editingCourse.description || '');
      setPrerequisites(editingCourse.prerequisites ? editingCourse.prerequisites.map(p => p.courseId) : []);
    } else {
      setTitle('');
      setCourseId('');
      setDescription('');
      setPrerequisites([]);
    }
  }, [editingCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const courseData = { title, courseId, description, prerequisites };

    try {
      if (isEditMode) {
        await updateCourse(editingCourse.courseId, courseData);
      } else {
        await createCourse(courseData);
      }
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (e) {
      setError(e.response?.data?.error || 'Operation failed');
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 6 } }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {isEditMode ? `Editing: ${editingCourse.title}` : 'Create a New Course'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Course ID" value={courseId} onChange={e => setCourseId(e.target.value)} fullWidth required disabled={isEditMode} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} fullWidth multiline rows={2} />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="prereq-label">Prerequisites</InputLabel>
              <Select
                labelId="prereq-label"
                multiple
                value={prerequisites}
                onChange={e => setPrerequisites(e.target.value)}
                input={<OutlinedInput label="Prerequisites" />}
                renderValue={selected => selected.join(', ')}
              >
                {allCourses.map(course => (
                  <MenuItem key={course.courseId} value={course.courseId}>
                    <Checkbox checked={prerequisites.indexOf(course.courseId) > -1} />
                    <ListItemText primary={course.title + ' (' + course.courseId + ')'} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" sx={{ mt: 1, mr: 1 }}>{isEditMode ? 'Save Changes' : 'Create Course'}</Button>
            {isEditMode && <Button variant="outlined" onClick={onCancelEdit}>Cancel</Button>}
          </Grid>
        </Grid>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
            {isEditMode ? 'Course updated successfully!' : 'Course created successfully!'}
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
};

export default CourseForm; 