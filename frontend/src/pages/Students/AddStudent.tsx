import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Stack,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';

type NullableDate = Date | null;

interface StudentForm {
  // About me
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  fatherOcc: string;
  motherOcc: string;
  dob: NullableDate;
  religion: string;
  className: string;
  section: string;
  roll: string;
  admissionDate: NullableDate;
  // Contact
  primaryPhone: string;
  secondaryPhone: string;
  primaryEmail: string;
  secondaryEmail: string;
  address: string;
  street: string;
  houseName: string;
  houseNumber: string;
}

const defaultForm: StudentForm = {
  firstName: '',
  lastName: '',
  fatherName: '',
  motherName: '',
  fatherOcc: '',
  motherOcc: '',
  dob: null,
  religion: '',
  className: '',
  section: '',
  roll: '',
  admissionDate: null,
  primaryPhone: '',
  secondaryPhone: '',
  primaryEmail: '',
  secondaryEmail: '',
  address: '',
  street: '',
  houseName: '',
  houseNumber: '',
};

const AddStudent: React.FC = () => {
  const [form, setForm] = useState<StudentForm>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (field: keyof StudentForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const api = axios.create({
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('access_token')
            ? { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            : {}),
        },
      });

      if (!form.primaryEmail) {
        throw new Error('Primary Email is required');
      }
      if (!form.firstName || !form.lastName) {
        throw new Error('First and Last name are required');
      }
      if (!form.admissionDate) {
        throw new Error('Admission Date is required');
      }

      const iso = (d: Date | null) => (d ? new Date(d).toISOString().slice(0, 10) : undefined);

      // 1) Create the student user + profile via auth/register (role: student)
      const registerPayload = {
        email: form.primaryEmail,
        username: form.primaryEmail,
        password: 'Passw0rd1!',
        first_name: form.firstName,
        last_name: form.lastName,
        role: 'student',
        date_of_birth: iso(form.dob),
        school_id: user?.school_id,
        parent_name: form.fatherName || form.motherName || undefined,
        parent_phone: form.primaryPhone || undefined,
        parent_email: form.primaryEmail || undefined,
        emergency_contact: form.secondaryPhone || undefined,
        previous_school: undefined,
      } as any;

      // Register will also create Student profile (backend updated)
      await api.post('/auth/register', registerPayload);

      navigate('/students');
    } catch (err: any) {
      // eslint-disable-next-line no-alert
      alert(err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Failed to add student');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit}>
        {/* Fancy header banner */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
            color: '#fff',
            boxShadow: '0 12px 30px rgba(59,130,246,0.25)'
          }}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                  <FavoriteRoundedIcon sx={{ color: '#fff' }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={800}>Add Student</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Create a new student profile and contact information</Typography>
                </Box>
              </Stack>
              <Chip label="New" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700 }} />
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          {/* About Me */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                background: 'linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(135deg, rgba(139,92,246,0.35), rgba(59,130,246,0.35)) border-box',
                border: '1px solid transparent',
                boxShadow: '0 8px 24px rgba(45,53,83,0.08)',
                transition: 'transform 120ms ease, box-shadow 120ms ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 28px rgba(45,53,83,0.12)' }
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(139,92,246,0.12)', color: '#8B5CF6', width: 32, height: 32 }}>
                    <PersonOutlineIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight={800}>About Me</Typography>
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><TextField label="First Name" fullWidth value={form.firstName} onChange={handleChange('firstName')} required /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Last Name" fullWidth value={form.lastName} onChange={handleChange('lastName')} required /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Father Name" fullWidth value={form.fatherName} onChange={handleChange('fatherName')} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Mother Name" fullWidth value={form.motherName} onChange={handleChange('motherName')} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Father Occupation" fullWidth value={form.fatherOcc} onChange={handleChange('fatherOcc')} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Mother Occupation" fullWidth value={form.motherOcc} onChange={handleChange('motherOcc')} /></Grid>
                  <Grid item xs={12} sm={6}><DatePicker label="Date of Birth" value={form.dob} onChange={(v) => setForm((p) => ({ ...p, dob: v }))} slotProps={{ textField: { fullWidth: true } }} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Religion" fullWidth value={form.religion} onChange={handleChange('religion')} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Class" fullWidth value={form.className} onChange={handleChange('className')} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Section" fullWidth value={form.section} onChange={handleChange('section')} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Roll" fullWidth value={form.roll} onChange={handleChange('roll')} /></Grid>
                  <Grid item xs={12} sm={6}><DatePicker label="Admission Date" value={form.admissionDate} onChange={(v) => setForm((p) => ({ ...p, admissionDate: v }))} slotProps={{ textField: { fullWidth: true } }} /></Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                background: 'linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(135deg, rgba(16,185,129,0.25), rgba(59,130,246,0.25)) border-box',
                border: '1px solid transparent',
                boxShadow: '0 8px 24px rgba(45,53,83,0.08)',
                transition: 'transform 120ms ease, box-shadow 120ms ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 28px rgba(45,53,83,0.12)' }
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(34,197,94,0.12)', color: '#22C55E', width: 32, height: 32 }}>
                    <ContactPhoneIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight={800}>Contact Information</Typography>
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><TextField label="Primary Phone" fullWidth value={form.primaryPhone} onChange={handleChange('primaryPhone')} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Secondary Phone" fullWidth value={form.secondaryPhone} onChange={handleChange('secondaryPhone')} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Primary Email" type="email" fullWidth value={form.primaryEmail} onChange={handleChange('primaryEmail')} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Secondary Email" type="email" fullWidth value={form.secondaryEmail} onChange={handleChange('secondaryEmail')} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Address" fullWidth value={form.address} onChange={handleChange('address')} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Street Address" fullWidth value={form.street} onChange={handleChange('street')} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="House Name" fullWidth value={form.houseName} onChange={handleChange('houseName')} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="House Number" fullWidth value={form.houseNumber} onChange={handleChange('houseNumber')} /></Grid>
                </Grid>
                <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                  <Button variant="outlined" color="inherit" onClick={() => navigate('/students')}>Cancel</Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                      boxShadow: '0 8px 18px rgba(59,130,246,0.25)',
                      '&:hover': { background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)' }
                    }}
                  >
                    Save
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default AddStudent;



