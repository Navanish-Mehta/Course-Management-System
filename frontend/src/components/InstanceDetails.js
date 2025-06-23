import React from 'react';
import { Typography, Box, Paper, Divider, Chip } from '@mui/material';

function InstanceDetails({ instance }) {
    if (!instance) {
        return null; // Don't render anything if no instance is selected
    }

    const { course, year, semester } = instance;

    return (
        <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Instance Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'primary.main' }}>{course.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Course ID: {course.courseId}
            </Typography>
            <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                {course.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label={`Year: ${year}`} color="primary" variant="outlined" />
                <Chip label={`Semester: ${semester}`} color="secondary" variant="outlined" />
            </Box>
        </Box>
    );
}

export default InstanceDetails; 