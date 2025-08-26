import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, TextField, Stack, Button, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

interface TeacherFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  klass: string;
}

const emptyValues: TeacherFormValues = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  klass: '',
};

const TeacherForm: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const isEdit = Boolean(params.id);
  const [values, setValues] = useState<TeacherFormValues>(emptyValues);

  useEffect(() => {
    if (isEdit) {
      // In a real app, fetch teacher by id. For now, seed minimal demo data
      setValues({
        name: 'Carla Peter',
        email: 'carla.peter@gmail.com',
        phone: '+88 9856418',
        subject: 'Maths',
        klass: '5th',
      });
    }
  }, [isEdit]);

  const handleChange = (field: keyof TeacherFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with backend
    navigate('/teachers');
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>{isEdit ? 'Edit Teacher' : 'Add Teacher'}</Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><TextField label="Full Name" fullWidth value={values.name} onChange={handleChange('name')} required /></Grid>
            <Grid item xs={12} md={6}><TextField label="Email" type="email" fullWidth value={values.email} onChange={handleChange('email')} required /></Grid>
            <Grid item xs={12} md={6}><TextField label="Phone" fullWidth value={values.phone} onChange={handleChange('phone')} required /></Grid>
            <Grid item xs={12} md={3}><TextField label="Subject" fullWidth value={values.subject} onChange={handleChange('subject')} required /></Grid>
            <Grid item xs={12} md={3}><TextField label="Class" fullWidth value={values.klass} onChange={handleChange('klass')} required /></Grid>
          </Grid>
          <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
            <Button variant="outlined" color="inherit" onClick={() => navigate('/teachers')}>Cancel</Button>
            <Button type="submit" variant="contained">{isEdit ? 'Update' : 'Create'}</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TeacherForm;


