import React, { useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Link as MUILink,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  FormLabel,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Avatar,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CalculateIcon from '@mui/icons-material/Calculate';
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ComputerIcon from '@mui/icons-material/Computer';
import BrushIcon from '@mui/icons-material/Brush';
import PublicIcon from '@mui/icons-material/Public';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import BiotechIcon from '@mui/icons-material/Biotech';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { Link, useNavigate } from 'react-router-dom';

type Category = 'STEM' | 'Humanities' | 'Arts' | 'Social Sciences' | 'Physical Education';

const categoryColors: Record<Category, string> = {
  STEM: '#6366F1',
  Humanities: '#06B6D4',
  Arts: '#F59E0B',
  'Social Sciences': '#10B981',
  'Physical Education': '#EF4444',
};

const iconOptions = [
  { key: 'calc', label: 'Calculator', icon: <CalculateIcon /> },
  { key: 'science', label: 'Science', icon: <ScienceIcon /> },
  { key: 'book', label: 'Book', icon: <MenuBookIcon /> },
  { key: 'cs', label: 'CS', icon: <ComputerIcon /> },
  { key: 'art', label: 'Art', icon: <BrushIcon /> },
  { key: 'globe', label: 'Globe', icon: <PublicIcon /> },
  { key: 'soccer', label: 'Soccer', icon: <SportsSoccerIcon /> },
  { key: 'music', label: 'Music', icon: <MusicNoteIcon /> },
  { key: 'biology', label: 'Biology', icon: <BiotechIcon /> },
  { key: 'psych', label: 'Psych', icon: <PsychologyIcon /> },
];

const AddSubject: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('STEM');
  const [iconKey, setIconKey] = useState<string>('calc');
  const [credits, setCredits] = useState<number | ''>('');
  const [duration, setDuration] = useState('1 Semester');
  const [maxStudents, setMaxStudents] = useState<number | ''>('');
  const [prerequisites, setPrerequisites] = useState('');
  const [schedule, setSchedule] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with backend; for now navigate back
    navigate('/subjects');
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <ArrowBackIosNewIcon fontSize="small" />
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <MUILink component={Link} underline="hover" color="inherit" to="/subjects">
            Back to Subjects
          </MUILink>
        </Breadcrumbs>
      </Stack>

      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Add New Subject</Typography>

      {/* Subject Preview */}
      <Card sx={{ mb: 2, borderRadius: 3, bgcolor: '#F5F7FF' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: `${categoryColors[category]}22`, color: categoryColors[category], width: 40, height: 40 }}>
                {iconOptions.find(i => i.key === iconKey)?.icon}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={800}>{name || 'Subject Name'}</Typography>
                <Typography variant="caption" color="text.secondary">{description || 'Subject description will appear here'}</Typography>
              </Box>
            </Stack>
            <Chip label={category} size="small" sx={{ bgcolor: '#fff' }} />
          </Stack>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card sx={{ mb: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>Basic Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><TextField label="Subject Name" placeholder="e.g., Advanced Mathematics" fullWidth value={name} onChange={(e) => setName(e.target.value)} required /></Grid>
            <Grid item xs={12} md={6}><TextField label="Department" placeholder="e.g., Mathematics Department" fullWidth value={department} onChange={(e) => setDepartment(e.target.value)} /></Grid>
            <Grid item xs={12}><TextField label="Description" placeholder="Describe the subject content, objectives, and what students will learn..." fullWidth multiline minRows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>Category</Typography>
          <ToggleButtonGroup
            color="primary"
            exclusive
            value={category}
            onChange={(_, v) => v && setCategory(v)}
            sx={{ flexWrap: 'wrap' }}
          >
            {(['STEM', 'Humanities', 'Arts', 'Social Sciences', 'Physical Education'] as Category[]).map(cat => (
              <ToggleButton key={cat} value={cat} sx={{ m: 0.5, borderRadius: 2 }}>{cat}</ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>Subject Icon</Typography>
          <ToggleButtonGroup value={iconKey} exclusive onChange={(_, v) => v && setIconKey(v)} sx={{ flexWrap: 'wrap' }}>
            {iconOptions.map(opt => (
              <ToggleButton key={opt.key} value={opt.key} sx={{ m: 0.5, borderRadius: 2 }}>
                <Stack alignItems="center" spacing={0.5} sx={{ px: 1 }}>
                  {opt.icon}
                  <Typography variant="caption">{opt.label}</Typography>
                </Stack>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </CardContent>
      </Card>

      {/* Academic Details */}
      <Card sx={{ mb: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>Academic Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}><TextField label="Credits" value={credits} onChange={(e) => setCredits(Number(e.target.value) || '')} fullWidth /></Grid>
            <Grid item xs={12} md={4}><TextField label="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} fullWidth placeholder="1 Semester" /></Grid>
            <Grid item xs={12} md={4}><TextField label="Max Students" value={maxStudents} onChange={(e) => setMaxStudents(Number(e.target.value) || '')} fullWidth /></Grid>
            <Grid item xs={12}><TextField label="Prerequisites" value={prerequisites} onChange={(e) => setPrerequisites(e.target.value)} fullWidth multiline minRows={2} placeholder="List any required courses or knowledge before taking this subject..." /></Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Schedule & Location */}
      <Card sx={{ mb: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>Schedule & Location</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="schedule">Schedule</InputLabel>
                <Select labelId="schedule" label="Schedule" value={schedule} onChange={(e) => setSchedule(e.target.value)}>
                  <MenuItem value="">Select schedule</MenuItem>
                  <MenuItem value="Mon-Wed-Fri 10:00-11:00">Mon-Wed-Fri 10:00-11:00</MenuItem>
                  <MenuItem value="Tue-Thu 14:00-16:00">Tue-Thu 14:00-16:00</MenuItem>
                  <MenuItem value="Sat 09:00-12:00">Sat 09:00-12:00</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}><TextField label="Classroom/Location" placeholder="e.g., Science Lab 1, Room 201" value={location} onChange={(e) => setLocation(e.target.value)} fullWidth /></Grid>
          </Grid>

          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button variant="outlined" color="inherit" component={Link} to="/subjects">Cancel</Button>
            <Button type="submit" variant="contained">Create Subject</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddSubject;


