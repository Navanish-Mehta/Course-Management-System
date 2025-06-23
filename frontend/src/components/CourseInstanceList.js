import React, { useState } from 'react';
import { getInstances, deleteInstance } from '../api/api';
import { Button, List, ListItem, ListItemText, Typography, IconButton, TextField, Box, Tooltip, Card, CardContent, Snackbar, Alert, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CourseInstanceList = ({ onSelect, onDeleted }) => {
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [instances, setInstances] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchInstances = async () => {
    setError('');
    try {
      const res = await getInstances(year, semester);
      setInstances(res.data);
    } catch (e) {
      setError('Failed to fetch instances');
    }
  };

  const handleDelete = async (instance) => {
    setDeleting(instance.id);
    setError('');
    try {
      await deleteInstance(instance.year, instance.semester, instance.course.courseId);
      fetchInstances();
      setDeleting(null);
      setSuccess(true);
      if (onDeleted) onDeleted();
    } catch (e) {
      setError(e.response?.data?.error || 'Delete failed');
      setDeleting(null);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Course Instances</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField label="Year" value={year} onChange={e => setYear(e.target.value)} size="small" />
        <TextField label="Semester" value={semester} onChange={e => setSemester(e.target.value)} size="small" />
        <Button variant="contained" onClick={fetchInstances}>Fetch</Button>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={2}>
        {instances.map(instance => (
          <Grid item xs={12} sm={6} key={instance.id}>
            <Card sx={{ boxShadow: 2, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 6 } }}>
              <CardContent>
                <ListItem disableGutters secondaryAction={
                  <Tooltip title="Delete">
                    <span>
                      <IconButton edge="end" color="error" disabled={deleting === instance.id} onClick={() => handleDelete(instance)}>
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                }>
                  <ListItemText
                    primary={<Typography variant="h6">{instance.course.title} ({instance.course.courseId})</Typography>}
                    secondary={`Year: ${instance.year}, Semester: ${instance.semester}`}
                    onClick={() => onSelect && onSelect(instance)}
                    style={{ cursor: 'pointer' }}
                  />
                </ListItem>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Instance deleted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseInstanceList; 