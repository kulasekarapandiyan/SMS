import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Class as ClassIcon,
  Book as BookIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

interface School {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  academic_year: string;
  is_active: boolean;
  created_at: string;
  statistics?: {
    total_students: number;
    total_teachers: number;
    total_classes: number;
    total_subjects: number;
  };
}

const Schools: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    phone: '',
    email: '',
    website: '',
    academic_year: '2024-2025',
    semester_system: true,
    grading_system: 'percentage',
    attendance_system: 'daily',
    primary_color: '#1976d2',
    secondary_color: '#dc004e',
    max_students_per_class: 40,
    max_teachers_per_subject: 3,
    enable_sms_notifications: false,
    enable_email_notifications: true,
  });

  const { user } = useAuth();

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/schools/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.schools) {
          setSchools(data.schools);
        } else if (data.school) {
          setSchools([data.school]);
        }
      } else {
        setError('Failed to fetch schools');
      }
    } catch (err) {
      setError('Error fetching schools');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (school?: School) => {
    if (school) {
      setEditingSchool(school);
      setFormData({
        name: school.name,
        address: school.address,
        city: school.city,
        state: school.state,
        country: school.country,
        postal_code: '',
        phone: school.phone,
        email: school.email,
        website: school.website,
        academic_year: school.academic_year,
        semester_system: true,
        grading_system: 'percentage',
        attendance_system: 'daily',
        primary_color: '#1976d2',
        secondary_color: '#dc004e',
        max_students_per_class: 40,
        max_teachers_per_subject: 3,
        enable_sms_notifications: false,
        enable_email_notifications: true,
      });
    } else {
      setEditingSchool(null);
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        phone: '',
        email: '',
        website: '',
        academic_year: '2024-2025',
        semester_system: true,
        grading_system: 'percentage',
        attendance_system: 'daily',
        primary_color: '#1976d2',
        secondary_color: '#dc004e',
        max_students_per_class: 40,
        max_teachers_per_subject: 3,
        enable_sms_notifications: false,
        enable_email_notifications: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSchool(null);
  };

  const handleSubmit = async () => {
    try {
      const url = editingSchool 
        ? `/api/schools/${editingSchool.id}`
        : '/api/schools/';
      
      const method = editingSchool ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        handleCloseDialog();
        fetchSchools();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save school');
      }
    } catch (err) {
      setError('Error saving school');
    }
  };

  const handleDelete = async (schoolId: number) => {
    if (!window.confirm('Are you sure you want to delete this school?')) {
      return;
    }

    try {
      const response = await fetch(`/api/schools/${schoolId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        fetchSchools();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete school');
      }
    } catch (err) {
      setError('Error deleting school');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Schools Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage multiple schools and their configurations
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {user?.role === 'super_admin' && (
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add New School
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {schools.map((school) => (
          <Grid item xs={12} md={6} lg={4} key={school.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2">
                    {school.name}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Code: {school.code}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  {school.address}, {school.city}, {school.state}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {school.phone} • {school.email}
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<PeopleIcon />}
                    label={`${school.statistics?.total_students || 0} Students`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<PeopleIcon />}
                    label={`${school.statistics?.total_teachers || 0} Teachers`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<ClassIcon />}
                    label={`${school.statistics?.total_classes || 0} Classes`}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={school.is_active ? 'Active' : 'Inactive'}
                    color={school.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </CardContent>
              
              {(user?.role === 'super_admin' || user?.role === 'school_admin' || user?.role === 'principal' || user?.role === 'director') && (
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(school)}
                  >
                    Edit
                  </Button>
                  {user?.role === 'super_admin' && (
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(school.id)}
                    >
                      Delete
                    </Button>
                  )}
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit School Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSchool ? 'Edit School' : 'Add New School'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="School Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Academic Year"
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSchool ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Schools;
