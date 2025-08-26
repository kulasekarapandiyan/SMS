import React, { useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ComputerIcon from '@mui/icons-material/Computer';
import BrushIcon from '@mui/icons-material/Brush';
import { useNavigate } from 'react-router-dom';

type Subject = {
  id: number;
  name: string;
  description: string;
  category: 'STEM' | 'Arts' | 'Language' | 'CS';
  students: number;
  teachers: number;
  teacherAssigned?: string; // demo single assignment
};

const seedSubjects: Subject[] = [
  { id: 1, name: 'Mathematics', description: 'Advanced mathematical concepts and problem solving', category: 'STEM', students: 245, teachers: 6 },
  { id: 2, name: 'Physics', description: 'Principles of matter and energy', category: 'STEM', students: 180, teachers: 4 },
  { id: 3, name: 'English Literature', description: 'Study of prose, poetry and drama', category: 'Language', students: 220, teachers: 5 },
  { id: 4, name: 'Computer Science', description: 'Programming and computational thinking', category: 'CS', students: 200, teachers: 3 },
  { id: 5, name: 'Art & Design', description: 'Creative expression and visual arts', category: 'Arts', students: 150, teachers: 2 },
];

const iconFor = (name: string) => {
  if (name.toLowerCase().includes('math')) return <CalculateIcon />;
  if (name.toLowerCase().includes('phys')) return <ScienceIcon />;
  if (name.toLowerCase().includes('computer')) return <ComputerIcon />;
  if (name.toLowerCase().includes('art')) return <BrushIcon />;
  return <MenuBookIcon />;
};

const colorFor = (category: Subject['category']) => {
  const map = {
    STEM: '#6366F1',
    Arts: '#F59E0B',
    Language: '#10B981',
    CS: '#0EA5E9',
  } as const;
  return map[category];
};

const Subjects: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>(seedSubjects);
  const [assignDialog, setAssignDialog] = useState<{ open: boolean; id?: number }>({ open: false });
  const [teacherName, setTeacherName] = useState('');

  const openAssign = (id: number, current?: string) => {
    setAssignDialog({ open: true, id });
    setTeacherName(current || '');
  };
  const doAssign = () => {
    setSubjects(prev => prev.map(s => s.id === assignDialog.id ? { ...s, teacherAssigned: teacherName, teachers: teacherName ? Math.max(1, s.teachers) : s.teachers } : s));
    setAssignDialog({ open: false });
  };
  const unassign = (id: number) => setSubjects(prev => prev.map(s => s.id === id ? { ...s, teacherAssigned: undefined } : s));

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Subjects</Typography>
        <Button variant="outlined" onClick={() => navigate('/subjects/add')}>Add Subject</Button>
      </Stack>

      <Grid container spacing={2}>
        {subjects.map((s) => (
          <Grid item xs={12} sm={6} md={4} key={s.id}>
            <Card sx={{ borderRadius: 3, background: 'linear-gradient(#ffffff, #ffffff) padding-box, rgba(99,102,241,0.08) border-box', border: '1px solid rgba(99,102,241,0.22)' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Avatar sx={{ bgcolor: `${colorFor(s.category)}20`, color: colorFor(s.category), width: 40, height: 40 }}>{iconFor(s.name)}</Avatar>
                  <Chip label={s.category} size="small" sx={{ bgcolor: '#F3F4F6' }} />
                </Stack>
                <Typography variant="h6" fontWeight={800} sx={{ mt: 1 }}>{s.name}</Typography>
                <Typography variant="body2" color="text.secondary">{s.description}</Typography>

                <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontWeight: 800 }}>{s.students.toLocaleString()}</Typography>
                    <Typography variant="caption" color="text.secondary">Students</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontWeight: 800 }}>{s.teachers}</Typography>
                    <Typography variant="caption" color="text.secondary">Teachers</Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  {!s.teacherAssigned ? (
                    <Button size="small" variant="contained" onClick={() => openAssign(s.id)}>Assign</Button>
                  ) : (
                    <>
                      <Chip size="small" label={`Assigned: ${s.teacherAssigned}`} />
                      <Button size="small" variant="outlined" onClick={() => openAssign(s.id, s.teacherAssigned)}>Reassign</Button>
                      <Button size="small" color="error" onClick={() => unassign(s.id)}>Unassign</Button>
                    </>
                  )}
                  <Button size="small" variant="text" onClick={() => navigate(`/subjects/${s.id}`)}>View</Button>
                  <Button size="small" variant="text" onClick={() => navigate(`/subjects/${s.id}/edit`)}>Edit</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Assign/Reassign Dialog */}
      <Dialog open={assignDialog.open} onClose={() => setAssignDialog({ open: false })}>
        <DialogTitle>{subjects.find(s => s.id === assignDialog.id)?.teacherAssigned ? 'Reassign Teacher' : 'Assign Teacher'}</DialogTitle>
        <DialogContent>
          <TextField label="Teacher Name" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialog({ open: false })}>Cancel</Button>
          <Button variant="contained" onClick={doAssign}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Subjects;

