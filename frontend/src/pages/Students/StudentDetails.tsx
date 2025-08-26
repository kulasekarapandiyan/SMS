import React, { useMemo, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Avatar, Stack, Button, Tabs, Tab, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, TextField, InputAdornment, Checkbox, IconButton } from '@mui/material';
import { useParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const LabelValue: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography fontWeight={600}>{value}</Typography>
  </Box>
);

type ExamRow = {
  id: string;
  studentId: string;
  name: string;
  klass: string;
  subject: string;
  grade: string;
  date: string;
};

const examRowsSeed: ExamRow[] = [
  { id: 'ex_01', studentId: 'PRE4317B', name: 'Class Test', klass: '9-10', subject: 'English', grade: 'A+', date: '22/2/19' },
  { id: 'ex_02', studentId: 'PRE4317B', name: 'Class Test', klass: '9-10', subject: 'Chemistry', grade: 'A+', date: '22/2/19' },
  { id: 'ex_03', studentId: 'PRE4317B', name: 'Class Test', klass: '9-10', subject: 'Biology', grade: 'A', date: '22/2/19' },
  { id: 'ex_04', studentId: 'PRE4317B', name: 'Fast Semester', klass: '9-10', subject: 'English', grade: 'A+', date: '22/2/19' },
  { id: 'ex_05', studentId: 'PRE4317B', name: 'Class Test', klass: '9-10', subject: 'Physics', grade: 'A+', date: '22/2/19' },
];

const donutData = [
  { name: 'Present', value: 70, color: '#8B5CF6' },
  { name: 'Absent', value: 30, color: '#F59E0B' },
];

const StudentDetails: React.FC = () => {
  const { id } = useParams();
  const [tab, setTab] = useState<'profile' | 'fees' | 'marks' | 'assignment'>('profile');
  const [openFullProfile, setOpenFullProfile] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const student = {
    firstName: 'Jessia',
    lastName: 'Rose',
    fatherName: 'Steve Jones',
    motherName: 'Naomi Rose',
    fatherOcc: 'Graphic Designer',
    motherOcc: 'House Wife',
    dob: '07-08-2015',
    religion: 'Christian',
    class: 'Two',
    section: 'Red',
    roll: '5648',
    admission: '09-01-2021',
    primaryPhone: '(555) 123-4567',
    secondaryPhone: '(555) 987-6543',
    primaryEmail: 'jessia12@gmail.com',
    secondaryEmail: 'steve48@gmail.com',
    address: 'Springfield',
    street: 'Elm Street',
    houseName: 'Meadowview',
    houseNumber: '62701',
  };

  const filteredRows = useMemo(() => {
    if (!search) return examRowsSeed;
    const q = search.toLowerCase();
    return examRowsSeed.filter(r => r.name.toLowerCase().includes(q) || r.studentId.toLowerCase().includes(q));
  }, [search]);

  const toggleSelectAll = (checked: boolean) => {
    setSelected(checked ? filteredRows.map(r => r.id) : []);
  };
  const toggleRow = (rowId: string) => {
    setSelected(prev => prev.includes(rowId) ? prev.filter(id => id !== rowId) : [...prev, rowId]);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Student {id ? `#${id}` : ''}</Typography>

      {/* Top summary row */}
      <Grid container spacing={2}>
        {/* Profile banner */}
        <Grid item xs={12} md={9}>
          <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg,#7C3AED 0%, #3B82F6 100%)', color: '#fff', boxShadow: '0 12px 30px rgba(59,130,246,0.25)' }}>
            <CardContent sx={{ py: 2.5 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(255,255,255,0.25)', color: '#fff', fontWeight: 700 }}>J</Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={800}>Jessia Rose</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationOnIcon fontSize="small" />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>Australia, House10</Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>Aliquam erat volutpat. Curabiene natis massa sedde lacus...</Typography>
                  </Box>
                </Stack>
                <Button variant="outlined" onClick={() => setOpenFullProfile(true)} sx={{ borderColor: 'rgba(255,255,255,0.65)', color: '#fff' }}>View Full Profile</Button>
              </Stack>
            </CardContent>
          </Card>

          {/* KPI cards aligned under banner width */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Avatar sx={{ bgcolor: 'rgba(99,102,241,0.12)', color: '#6366F1', width: 30, height: 30 }}>
                      <NotificationsNoneIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 18, lineHeight: 1 }}>12</Typography>
                      <Typography variant="caption" color="text.secondary">This Month</Typography>
                      <Typography variant="body2" sx={{ mt: 0.25 }}>Notification</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Avatar sx={{ bgcolor: 'rgba(16,185,129,0.12)', color: '#10B981', width: 30, height: 30 }}>
                      <EventNoteIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 18, lineHeight: 1 }}>16</Typography>
                      <Typography variant="caption" color="text.secondary">Arranged</Typography>
                      <Typography variant="body2" sx={{ mt: 0.25 }}>Events</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Avatar sx={{ bgcolor: 'rgba(245,158,11,0.12)', color: '#F59E0B', width: 30, height: 30 }}>
                      <TrendingUpIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 18, lineHeight: 1 }}>95%</Typography>
                      <Typography variant="caption" color="text.secondary">Monthly</Typography>
                      <Typography variant="body2" sx={{ mt: 0.25 }}>Attendance</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Attendance donut */}
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={700}>Attendance</Typography>
                <IconButton size="small"><MoreHorizIcon /></IconButton>
              </Stack>
              <Box sx={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} innerRadius={55} outerRadius={85} paddingAngle={2} dataKey={"value"}>
                      {donutData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Stack direction="row" spacing={2} justifyContent="center">
                {donutData.map(d => (
                  <Stack key={d.name} direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 10, height: 10, bgcolor: d.color, borderRadius: '50%' }} />
                    <Typography variant="caption" color="text.secondary">{d.name}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Exam results table */}
      <Card sx={{ mt: 3, borderRadius: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>All Exam Results</Typography>
            <TextField size="small" placeholder="Search by name or roll" value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} />
          </Stack>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.length > 0 && selected.length === filteredRows.length}
                      indeterminate={selected.length > 0 && selected.length < filteredRows.length}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>Exam Name</TableCell>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selected.includes(r.id)} onChange={() => toggleRow(r.id)} />
                    </TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.studentId}</TableCell>
                    <TableCell>{r.klass}</TableCell>
                    <TableCell>{r.subject}</TableCell>
                    <TableCell>{r.grade}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                      <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small"><DeleteOutlineIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Full profile dialog showing the detailed tabs */}
      <Dialog open={openFullProfile} onClose={() => setOpenFullProfile(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Full Profile - {student.firstName} {student.lastName}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', bgcolor: '#F5F7FF', borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: '#8B5CF6', color: '#fff', fontWeight: 700 }}>J</Avatar>
                    <Box>
                      <Typography fontWeight={700}>Jessia Rose</Typography>
                      <Typography variant="caption" color="text.secondary">Users</Typography>
                    </Box>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={6}><LabelValue label="First Name" value={student.firstName} /></Grid>
                    <Grid item xs={6}><LabelValue label="Last Name" value={student.lastName} /></Grid>
                    <Grid item xs={6}><LabelValue label="Father Name" value={student.fatherName} /></Grid>
                    <Grid item xs={6}><LabelValue label="Mother Name" value={student.motherName} /></Grid>
                    <Grid item xs={6}><LabelValue label="Father Occupation" value={student.fatherOcc} /></Grid>
                    <Grid item xs={6}><LabelValue label="Mother Occupation" value={student.motherOcc} /></Grid>
                    <Grid item xs={6}><LabelValue label="Date of Birth" value={student.dob} /></Grid>
                    <Grid item xs={6}><LabelValue label="Religion" value={student.religion} /></Grid>
                    <Grid item xs={6}><LabelValue label="Class" value={student.class} /></Grid>
                    <Grid item xs={6}><LabelValue label="Section" value={student.section} /></Grid>
                    <Grid item xs={6}><LabelValue label="Roll" value={student.roll} /></Grid>
                    <Grid item xs={6}><LabelValue label="Admission Date" value={student.admission} /></Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 3 }}>
                <CardContent>
                  <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary" sx={{ mb: 2 }}>
                    <Tab value="profile" label="Profile" />
                    <Tab value="fees" label="Fees" />
                    <Tab value="marks" label="Marks" />
                    <Tab value="assignment" label="Assignment" />
                  </Tabs>

                  {tab === 'profile' && (
                    <Grid container spacing={2}>
                      <Grid item xs={6}><LabelValue label="Primary Phone" value={student.primaryPhone} /></Grid>
                      <Grid item xs={6}><LabelValue label="Secondary Phone" value={student.secondaryPhone} /></Grid>
                      <Grid item xs={6}><LabelValue label="Primary Email" value={student.primaryEmail} /></Grid>
                      <Grid item xs={6}><LabelValue label="Secondary Email" value={student.secondaryEmail} /></Grid>
                      <Grid item xs={6}><LabelValue label="Address" value={student.address} /></Grid>
                      <Grid item xs={6}><LabelValue label="Street Address" value={student.street} /></Grid>
                      <Grid item xs={6}><LabelValue label="House Name" value={student.houseName} /></Grid>
                      <Grid item xs={6}><LabelValue label="House Number" value={student.houseNumber} /></Grid>
                    </Grid>
                  )}

                  {tab === 'fees' && (
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Fees Summary</Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Chip label="Total: $1200" color="primary" variant="outlined" />
                        <Chip label="Paid: $900" color="success" variant="outlined" />
                        <Chip label="Due: $300" color="warning" variant="outlined" />
                      </Stack>
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Receipt</TableCell>
                              <TableCell>Amount</TableCell>
                              <TableCell>Date</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {[1,2,3].map(i => (
                              <TableRow key={i}>
                                <TableCell>#{1000+i}</TableCell>
                                <TableCell>$300</TableCell>
                                <TableCell>2025-08-0{i}</TableCell>
                                <TableCell><Chip label={i<3? 'Paid':'Due'} color={i<3? 'success':'warning'} size="small" /></TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}

                  

                  {tab === 'marks' && (
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Marks</Typography>
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Subject</TableCell>
                              <TableCell>Midterm</TableCell>
                              <TableCell>Final</TableCell>
                              <TableCell>Average</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {[
                              { s: 'Mathematics', m: 85, f: 90 },
                              { s: 'Science', m: 78, f: 88 },
                              { s: 'English', m: 82, f: 86 },
                            ].map(r => (
                              <TableRow key={r.s}>
                                <TableCell>{r.s}</TableCell>
                                <TableCell>{r.m}</TableCell>
                                <TableCell>{r.f}</TableCell>
                                <TableCell>{Math.round((r.m + r.f)/2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}

                  {tab === 'assignment' && (
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Assignments</Typography>
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Title</TableCell>
                              <TableCell>Subject</TableCell>
                              <TableCell>Due Date</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {[
                              { t: 'Algebra Worksheet', s: 'Math', d: '2025-08-20', status: 'Submitted' },
                              { t: 'Lab Report', s: 'Science', d: '2025-08-22', status: 'Pending' },
                            ].map(a => (
                              <TableRow key={a.t}>
                                <TableCell>{a.t}</TableCell>
                                <TableCell>{a.s}</TableCell>
                                <TableCell>{a.d}</TableCell>
                                <TableCell><Chip size="small" color={a.status === 'Submitted' ? 'success' : 'warning'} label={a.status} /></TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StudentDetails;


