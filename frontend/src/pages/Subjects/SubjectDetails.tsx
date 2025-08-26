import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Avatar,
  Grid,
  Tabs,
  Tab,
  Button,
  Divider,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RoomIcon from '@mui/icons-material/Room';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import StarRateIcon from '@mui/icons-material/StarRate';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';

const SubjectDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tab, setTab] = useState<'overview' | 'teachers' | 'classes' | 'analytics'>('overview');

  // Demo subject data – replace with API fetch later
  const subject = {
    id: Number(id) || 1,
    name: 'Mathematics',
    description:
      'Advanced mathematical concepts including calculus, algebra, geometry, and statistical analysis. This comprehensive course prepares students for higher education and practical applications in various fields.',
    category: 'STEM',
    department: 'Mathematics Department',
    credits: 4,
    duration: '1 Semester',
    prerequisites: 'Algebra II, Geometry',
    students: 245,
    teachers: 6,
    classes: 12,
    avgGrade: 'B+',
    performance: 88,
    schedule: 'Mon, Wed, Fri',
    room: 'Math Wing A',
    maxStudents: 30,
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Button startIcon={<ArrowBackIosNewIcon />} component={RouterLink} to="/subjects" color="inherit">
          Back to Subjects
        </Button>
      </Stack>

      {/* Header banner */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 12px 30px rgba(99,102,241,0.08)', mb: 2 }}>
        <CardContent>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar sx={{ bgcolor: '#6366F1', width: 56, height: 56 }}>
                <CalculateIcon sx={{ color: '#fff' }} />
              </Avatar>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h5" fontWeight={800}>{subject.name}</Typography>
                  <Chip size="small" label={subject.category} />
                </Stack>
                <Typography sx={{ mt: 1 }} color="text.secondary">
                  {subject.description}
                </Typography>
                <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarMonthIcon fontSize="small" />
                    <Typography variant="caption">{subject.schedule}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <RoomIcon fontSize="small" />
                    <Typography variant="caption">{subject.room}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="caption">{subject.duration}</Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
            <Stack alignItems="flex-end">
              <Button variant="outlined" onClick={() => navigate(`/subjects/${subject.id}/edit`)}>Edit Subject</Button>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <StarRateIcon sx={{ color: '#F59E0B' }} />
                <Typography variant="h6" fontWeight={800}>{subject.avgGrade}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* KPI cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Stack alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <PeopleAltIcon color="success" />
                <Typography variant="h5" fontWeight={800}>{subject.students}</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">Students Enrolled</Typography>
            </Stack>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Stack alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <SchoolIcon color="primary" />
                <Typography variant="h5" fontWeight={800}>{subject.teachers}</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">Teachers</Typography>
            </Stack>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Stack alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <MenuBookIcon color="secondary" />
                <Typography variant="h5" fontWeight={800}>{subject.classes}</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">Active Classes</Typography>
            </Stack>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Stack alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <TrendingUpIcon color="success" />
                <Typography variant="h5" fontWeight={800}>{subject.performance}%</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">Performance</Typography>
            </Stack>
          </CardContent></Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab value="overview" label="Overview" />
            <Tab value="teachers" label="Teachers" />
            <Tab value="classes" label="Classes" />
            <Tab value="analytics" label="Analytics" />
          </Tabs>

          {tab === 'overview' && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Card variant="outlined"><CardContent>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>Subject Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}><Typography variant="caption" color="text.secondary">Department</Typography><Typography>{subject.department}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="caption" color="text.secondary">Credits</Typography><Typography>{subject.credits}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="caption" color="text.secondary">Max Students</Typography><Typography>{subject.maxStudents}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="caption" color="text.secondary">Duration</Typography><Typography>{subject.duration}</Typography></Grid>
                    <Grid item xs={12}><Divider sx={{ my: 1 }} /><Typography variant="caption" color="text.secondary">Prerequisites</Typography><Typography>{subject.prerequisites}</Typography></Grid>
                  </Grid>
                </CardContent></Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined"><CardContent>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>Recent Activities</Typography>
                  <Stack spacing={1.5}>
                    {[ 'New assignment posted', 'Grades updated', 'Class announcement', 'New student enrolled' ].map((txt) => (
                      <Stack key={txt} direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 28, height: 28 }}>•</Avatar>
                        <Typography variant="body2">{txt}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent></Card>
              </Grid>
            </Grid>
          )}

          {tab === 'teachers' && (
            <Grid container spacing={2}>
              {[1,2,3].map(i => (
                <Grid item xs={12} md={4} key={i}>
                  <Card variant="outlined"><CardContent>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                      <Avatar> T{i} </Avatar>
                      <Box>
                        <Typography fontWeight={700}>Teacher {i}</Typography>
                        <Typography variant="caption" color="text.secondary">teacher{i}@school.edu</Typography>
                      </Box>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">Specialization</Typography>
                    <Typography>Algebra & Geometry</Typography>
                    <Button size="small" sx={{ mt: 1 }} variant="contained">Contact</Button>
                  </CardContent></Card>
                </Grid>
              ))}
            </Grid>
          )}

          {tab === 'classes' && (
            <Grid container spacing={2}>
              {[1,2,3].map(i => (
                <Grid item xs={12} md={4} key={i}>
                  <Card variant="outlined"><CardContent>
                    <Typography variant="subtitle1" fontWeight={800}>Math 10{i}-A</Typography>
                    <Typography variant="caption" color="text.secondary">Dr. Smith</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="caption" color="text.secondary">Schedule</Typography>
                    <Typography>MWF 10:00-11:00</Typography>
                    <Typography variant="caption" color="text.secondary">Room</Typography>
                    <Typography>Wing A-10{i}</Typography>
                    <Button size="small" sx={{ mt: 1 }} variant="outlined">View Class</Button>
                  </CardContent></Card>
                </Grid>
              ))}
            </Grid>
          )}

          {tab === 'analytics' && (
            <Grid container spacing={2}>
              {[{label:'Completion Rate', value:'94.2%'}, {label:'Attendance Rate', value:'96.8%'}, {label:'Student Satisfaction', value:'4.6/5'}].map(m => (
                <Grid item xs={12} md={4} key={m.label}>
                  <Card variant="outlined"><CardContent>
                    <Typography variant="caption" color="text.secondary">{m.label}</Typography>
                    <Typography variant="h5" fontWeight={800}>{m.value}</Typography>
                  </CardContent></Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SubjectDetails;


