import React, { useEffect, useState } from 'react';
import { getCourses, deleteCourse } from '../api/api';
import { List, ListItem, ListItemText, Typography, IconButton, Tooltip, Card, CardContent, Box, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const CourseList = ({ onEdit }) => {
  const [courses, setCourses] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (e) {
      setError('Failed to fetch courses');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    setDeleting(courseId);
    setError('');
    try {
      await deleteCourse(courseId);
      setDeleting(null);
      fetchCourses();
    } catch (e) {
      setError(e.response?.data?.error || 'Delete failed');
      setDeleting(null);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>Available Courses</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={2}>
        {courses.map(course => {
          const isPrerequisite = courses.some(c => c.prerequisites?.some(p => p.id === course.id));
          return (
            <Grid item xs={12} md={6} key={course.id}>
              <Card sx={{ mb: 2, boxShadow: 2, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 6 } }}>
                <CardContent>
                  <ListItem
                    disableGutters
                    secondaryAction={
                      <Box>
                        <Tooltip title="Edit Course">
                          <IconButton edge="end" color="primary" onClick={() => onEdit(course)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={isPrerequisite ? 'Cannot delete: prerequisite for another course' : 'Delete'}>
                          <span>
                            <IconButton edge="end" color="error" disabled={isPrerequisite || deleting === course.courseId} onClick={() => handleDelete(course.courseId)}>
                              <DeleteIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={<Typography variant="h6">{course.title} ({course.courseId})</Typography>}
                      secondary={
                        course.prerequisites && course.prerequisites.length > 0
                          ? 'Prerequisites: ' + course.prerequisites.map(p => p.courseId).join(', ')
                          : 'No prerequisites'
                      }
                    />
                  </ListItem>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CourseList; 