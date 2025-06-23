import React, { useState } from 'react';
import { Container, Tabs, Tab, Box, AppBar, Toolbar, Typography, CssBaseline, Modal, Paper } from '@mui/material';
import CourseList from './components/CourseList';
import CourseForm from './components/CourseForm';
import CourseInstanceList from './components/CourseInstanceList';
import CourseInstanceForm from './components/CourseInstanceForm';
import InstanceDetails from './components/InstanceDetails';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function App() {
  const [tab, setTab] = useState(0);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleContentUpdate = () => {
    setRefreshKey(prevKey => prevKey + 1);
    setEditingCourse(null);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    window.scrollTo(0, 0);
  };

  const handleInstanceSelect = (instance) => {
    setSelectedInstance(instance);
  };

  const handleCloseModal = () => {
    setSelectedInstance(null);
  };

  return (
    <Box sx={{ bgcolor: '#f5f6fa', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Course Management Portal
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 3 }}>
            <Tab label="Courses" />
            <Tab label="Course Instances" />
          </Tabs>
          <Box>
            {tab === 0 && (
              <>
                <CourseForm
                  onSuccess={handleContentUpdate}
                  editingCourse={editingCourse}
                  onCancelEdit={() => setEditingCourse(null)}
                />
                <CourseList key={`courses-${refreshKey}`} onEdit={handleEditCourse} />
              </>
            )}
            {tab === 1 && (
              <>
                <CourseInstanceForm onSuccess={handleContentUpdate} />
                <CourseInstanceList key={`instances-${refreshKey}`} onSelect={handleInstanceSelect} />
                <Modal open={Boolean(selectedInstance)} onClose={handleCloseModal}>
                  <Box sx={modalStyle}>
                    <InstanceDetails instance={selectedInstance} />
                  </Box>
                </Modal>
              </>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
