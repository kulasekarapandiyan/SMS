import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Menu,
  MenuItem as MUIMenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';

type Teacher = { id: number; name: string; subject: string; initials: string };
const teachers: Teacher[] = [
  { id: 1, name: 'Dr. Sarah Wilson', subject: 'Mathematics', initials: 'SW' },
  { id: 2, name: 'Prof. James Chen', subject: 'Physics', initials: 'JC' },
  { id: 3, name: 'Ms. Emily Rodriguez', subject: 'English', initials: 'ER' },
  { id: 4, name: 'Mr. David Kim', subject: 'Computer Science', initials: 'DK' },
  { id: 5, name: 'Dr. Maria Santos', subject: 'Biology', initials: 'MS' },
  { id: 6, name: 'Ms. Sophie Turner', subject: 'Art', initials: 'ST' },
  { id: 7, name: 'Mr. Robert Brown', subject: 'History', initials: 'RB' },
  { id: 8, name: 'Dr. Lisa Wang', subject: 'Chemistry', initials: 'LW' },
];

type Subject = { id: string; name: string; teacher: Teacher; color: string };
type Grade = { id: number; name: string; level: string; students: number; sections: number; subjects: Subject[]; color: string; bgGradient: string };

const initialGrades: Grade[] = [
  { id: 1, name: 'Grade 1', level: 'Primary', students: 125, sections: 4, color: '#E11D48', bgGradient: 'linear-gradient(135deg,#FFE4E6,#FCE7F3)', subjects: [
    { id: '1-1', name: 'Mathematics', teacher: teachers[0], color: '#DBEAFE' },
    { id: '1-2', name: 'English', teacher: teachers[2], color: '#DCFCE7' },
    { id: '1-3', name: 'Science', teacher: teachers[4], color: '#E9D5FF' },
  ]},
  { id: 2, name: 'Grade 2', level: 'Primary', students: 118, sections: 4, color: '#D97706', bgGradient: 'linear-gradient(135deg,#FFFBEB,#FFF7ED)', subjects: [
    { id: '2-1', name: 'Mathematics', teacher: teachers[0], color: '#DBEAFE' },
    { id: '2-2', name: 'English', teacher: teachers[2], color: '#DCFCE7' },
    { id: '2-3', name: 'Art', teacher: teachers[5], color: '#FCE7F3' },
  ]},
];

const Classes: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>(initialGrades);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuGradeId, setMenuGradeId] = useState<number | null>(null);

  const availableSubjects = ['Mathematics','English','Science','Physics','Chemistry','Biology','History','Geography','Computer Science','Art','Music','Physical Education','French','Spanish','Economics','Psychology','Literature','Philosophy'];

  const addSubjectToGrade = () => {
    if (!selectedGrade || !newSubject || !selectedTeacher) return;
    const teacher = teachers.find(t => t.id.toString() === selectedTeacher);
    if (!teacher) return;
    const palette = ['#DBEAFE','#DCFCE7','#E9D5FF','#FFEDD5','#FCE7F3','#FEF9C3','#FECACA','#CCFBF1'];
    const subject: Subject = { id: `${selectedGrade.id}-${Date.now()}`, name: newSubject, teacher, color: palette[Math.floor(Math.random()*palette.length)] };
    setGrades(prev => prev.map(g => g.id === selectedGrade.id ? { ...g, subjects: [...g.subjects, subject] } : g));
    setIsAddSubjectOpen(false);
    setNewSubject('');
    setSelectedTeacher('');
  };

  const removeSubjectFromGrade = (gradeId: number, subjectId: string) => {
    setGrades(prev => prev.map(g => g.id === gradeId ? { ...g, subjects: g.subjects.filter(s => s.id !== subjectId) } : g));
  };

  const addSectionToGrade = (gradeId: number) => {
    setGrades(prev => prev.map(g => g.id === gradeId ? { ...g, sections: g.sections + 1 } : g));
    setNewSectionName('');
  };

  const removeSectionFromGrade = (gradeId: number) => {
    setGrades(prev => prev.map(g => g.id === gradeId ? { ...g, sections: Math.max(0, g.sections - 1) } : g));
  };

  const deleteGrade = (gradeId: number) => {
    setGrades(prev => prev.filter(g => g.id !== gradeId));
    setMenuAnchor(null);
    setMenuGradeId(null);
  };

  const openMenu = (e: React.MouseEvent<HTMLElement>, gradeId: number) => {
    setMenuAnchor(e.currentTarget);
    setMenuGradeId(gradeId);
  };
  const closeMenu = () => { setMenuAnchor(null); setMenuGradeId(null); };

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Class & Sections</Typography>
          <Typography variant="body2" color="text.secondary">Organize grades, subjects, and teacher assignments</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" startIcon={<LayersIcon />}>Academic Year</Button>
          <Button size="small" startIcon={<AddIcon />} onClick={() => setIsAddGradeOpen(true)}>Add Grade</Button>
        </Stack>
      </Stack>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg,#EFF6FF,#EEF2FF)', border: '1px solid #DBEAFE' }}><CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <LayersIcon sx={{ color: '#2563EB' }} />
              <Box>
                <Typography variant="h5" fontWeight={800}>{grades.length}</Typography>
                <Typography variant="caption" color="text.secondary">Total Grades</Typography>
              </Box>
            </Stack>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg,#ECFDF5,#F0FDF4)', border: '1px solid #A7F3D0' }}><CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <SchoolIcon sx={{ color: '#059669' }} />
              <Box>
                <Typography variant="h5" fontWeight={800}>{grades.reduce((a,g)=>a+g.subjects.length,0)}</Typography>
                <Typography variant="caption" color="text.secondary">Active Subjects</Typography>
              </Box>
            </Stack>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg,#FAF5FF,#F5F3FF)', border: '1px solid #E9D5FF' }}><CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <GroupsIcon sx={{ color: '#7C3AED' }} />
              <Box>
                <Typography variant="h5" fontWeight={800}>{grades.reduce((a,g)=>a+g.students,0)}</Typography>
                <Typography variant="caption" color="text.secondary">Total Students</Typography>
              </Box>
            </Stack>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', border: '1px solid #FDE68A' }}><CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <GroupsIcon sx={{ color: '#D97706' }} />
              <Box>
                <Typography variant="h5" fontWeight={800}>{teachers.length}</Typography>
                <Typography variant="caption" color="text.secondary">Assigned Teachers</Typography>
              </Box>
            </Stack>
          </CardContent></Card>
        </Grid>
      </Grid>

      {/* Grades Grid (equal heights per row) */}
      <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
        {grades.map((g) => (
          <Grid item xs={12} md={6} lg={4} key={g.id} sx={{ display: 'flex' }}>
            <Card sx={{ border: '1px solid rgba(0,0,0,0.06)', background: g.bgGradient, display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 1 }}>
                        <SchoolIcon sx={{ color: g.color }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ color: g.color, fontWeight: 800 }}>{g.name}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip size="small" variant="outlined" label={g.level} sx={{ bgcolor: 'rgba(255,255,255,0.6)' }} />
                          <Chip size="small" icon={<PersonOutlineIcon sx={{ fontSize: 14 }} />} label={`${g.students} students`} sx={{ bgcolor: 'rgba(255,255,255,0.6)' }} />
                          <Chip size="small" icon={<LayersOutlinedIcon sx={{ fontSize: 14 }} />} label={`${g.sections} sections`} sx={{ bgcolor: 'rgba(255,255,255,0.6)' }} />
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <IconButton aria-label="View Details"><VisibilityIcon /></IconButton>
                    <IconButton aria-label="More" onClick={(e) => openMenu(e, g.id)}><MoreHorizIcon /></IconButton>
                  </Stack>
                </Stack>

                {/* Subjects */}
                <Box sx={{ mt: 2, flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">Subjects</Typography>
                    <Button size="small" variant="text" startIcon={<AddIcon />} onClick={() => { setSelectedGrade(g); setIsAddSubjectOpen(true); }}>Add Subject</Button>
                  </Stack>
                  {g.subjects.length ? (
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {g.subjects.map((s) => (
                        <Stack key={s.id} direction="row" spacing={0.5} alignItems="center" sx={{ px: 1.5, py: 0.5, borderRadius: 4, bgcolor: s.color, border: '1px solid rgba(0,0,0,0.08)' }}>
                          <Typography variant="caption">{s.name}</Typography>
                          <Chip size="small" label={s.teacher.initials} variant="outlined" />
                          <IconButton size="small" onClick={() => removeSubjectFromGrade(g.id, s.id)}><CloseIcon fontSize="inherit" /></IconButton>
                        </Stack>
                      ))}
                    </Stack>
                  ) : (
                    <Box sx={{ textAlign: 'center', border: '1px dashed rgba(0,0,0,0.1)', borderRadius: 1, p: 1 }}>No subjects assigned yet</Box>
                  )}
                </Box>

                {/* Grade Actions */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2, pt: 1, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <Typography variant="caption" color="text.secondary">{g.subjects.length} subjects assigned</Typography>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" onClick={() => addSectionToGrade(g.id)}>Add Section</Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Per-grade menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MUIMenuItem onClick={() => { if (menuGradeId != null) addSectionToGrade(menuGradeId); closeMenu(); }}>
          <ListItemIcon><AddIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Add Section</ListItemText>
        </MUIMenuItem>
        <MUIMenuItem disableRipple>
          <ListItemIcon><LayersOutlinedIcon fontSize="small" /></ListItemIcon>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Sections</Typography>
            <Button size="small" onClick={() => { if (menuGradeId != null) removeSectionFromGrade(menuGradeId); }}>-</Button>
            <Typography variant="body2">{menuGradeId != null ? grades.find(g => g.id === menuGradeId)?.sections : ''}</Typography>
            <Button size="small" onClick={() => { if (menuGradeId != null) addSectionToGrade(menuGradeId); }}>+</Button>
          </Stack>
        </MUIMenuItem>
        <Divider />
        <MUIMenuItem onClick={() => { if (menuGradeId != null) deleteGrade(menuGradeId); }} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}><CloseIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Delete Grade</ListItemText>
        </MUIMenuItem>
      </Menu>

      {/* Add Subject Dialog */}
      <Dialog open={isAddSubjectOpen} onClose={() => setIsAddSubjectOpen(false)}>
        <DialogTitle>Add Subject</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="subject">Subject</InputLabel>
              <Select labelId="subject" label="Subject" value={newSubject} onChange={(e) => setNewSubject(e.target.value)}>
                {availableSubjects.map(s => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="teacher">Teacher</InputLabel>
              <Select labelId="teacher" label="Teacher" value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
                {teachers.map(t => (<MenuItem key={t.id} value={t.id.toString()}>{t.name} — {t.subject}</MenuItem>))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddSubjectOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={addSubjectToGrade}>Add Subject</Button>
        </DialogActions>
      </Dialog>

      {/* Add Grade Dialog (placeholder) */}
      <Dialog open={isAddGradeOpen} onClose={() => setIsAddGradeOpen(false)}>
        <DialogTitle>Add New Grade</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Grade Name" placeholder="e.g., Grade 7" sx={{ mt: 1 }} />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="level">Education Level</InputLabel>
            <Select labelId="level" label="Education Level" defaultValue="primary">
              <MenuItem value="primary">Primary</MenuItem>
              <MenuItem value="middle">Middle School</MenuItem>
              <MenuItem value="high">High School</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddGradeOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setIsAddGradeOpen(false)}>Create Grade</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Classes;

