import React, { useMemo, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Chip, List, ListItem, ListItemText, Divider, Stack, Avatar, IconButton } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatCard from '../../components/Dashboard/StatCard';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import Badge from '@mui/material/Badge';
import { format, isSameMonth } from 'date-fns';

const Dashboard: React.FC = () => {
  // Simple demo events for current month
  const eventsByDate: Record<string, { title: string; category: 'exam' | 'meeting' | 'holiday' }[]> = useMemo(() => ({
    [format(new Date(), 'yyyy-MM-10')]: [
      { title: 'Inter-school competition', category: 'exam' },
    ],
    [format(new Date(), 'yyyy-MM-16')]: [
      { title: 'Parent-Teacher Meeting', category: 'meeting' },
    ],
    [format(new Date(), 'yyyy-MM-22')]: [
      { title: 'Sports Day', category: 'holiday' },
    ],
  }), []);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const highlightedDays = useMemo(() => {
    if (!selectedDate) return [] as number[];
    return Object.keys(eventsByDate)
      .map((k) => new Date(k))
      .filter((d) => isSameMonth(d, selectedDate))
      .map((d) => d.getDate());
  }, [selectedDate, eventsByDate]);

  function EventDay(
    props: PickersDayProps<Date> & { highlightedDays?: number[] }
  ) {
    const { day, outsideCurrentMonth, highlightedDays: days = [], ...other } = props;
    const hasEvent = !outsideCurrentMonth && days.indexOf(day.getDate()) >= 0;
    return (
      <Badge
        overlap="circular"
        sx={{ '& .MuiBadge-badge': { bgcolor: '#FF4D8D' } }}
        variant="dot"
        invisible={!hasEvent}
      >
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Badge>
    );
  }

  const eventsForSelected = useMemo(() => {
    const key = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
    return eventsByDate[key] || [];
  }, [selectedDate, eventsByDate]);

  return (
    <Box>
      {/* School Name Header (no welcome) */}
      <Typography variant="h5" sx={{ fontWeight: 800, textTransform: 'uppercase', color: '#2D3553', mb: 2 }}>
        Jawahar Nursery and Primary School
      </Typography>
      {/* Top KPI Cards */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Students" value={2847} subtitle="Total Students" icon={<PeopleAltIcon sx={{ color: '#fff' }} />} color="#3B82F6" growth="+12%" softBg="#F5F7FF" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Teachers" value={186} subtitle="Active Teachers" icon={<SchoolIcon sx={{ color: '#fff' }} />} color="#EAB308" growth="+3%" softBg="#FFFBEB" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Courses" value={94} subtitle="Total Courses" icon={<MenuBookIcon sx={{ color: '#fff' }} />} color="#2563EB" growth="+8%" softBg="#F5F7FF" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Monthly Revenue" value={84329} subtitle="Monthly Revenue" icon={<AttachMoneyIcon sx={{ color: '#fff' }} />} color="#16A34A" growth="+15%" softBg="#F0FFF4" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Earnings with chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 2, bgcolor: '#F5F7FF', borderRadius: 3, transition: 'box-shadow .2s, transform .2s', '&:hover': { boxShadow: '0 8px 24px rgba(45,53,83,0.12)', transform: 'translateY(-2px)' } }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="h6" fontWeight={700}>Earnings</Typography>
                <IconButton size="small"><MoreHorizIcon /></IconButton>
              </Stack>
              <Box height={260}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{m:'Jan',earn:40,exp:24},{m:'Feb',earn:30,exp:13},{m:'Mar',earn:20,exp:18},{m:'Apr',earn:27,exp:39},{m:'May',earn:18,exp:28},{m:'Jun',earn:23,exp:38},{m:'Jul',earn:34,exp:21},{m:'Aug',earn:45,exp:31},{m:'Sep',earn:32,exp:13},{m:'Oct',earn:26,exp:25},{m:'Nov',earn:38,exp:20},{m:'Dec',earn:44,exp:18}]}
                           margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="m" />
                    <YAxis />
                    <ReTooltip />
                    <Legend />
                    <Bar dataKey="earn" name="Earnings" fill="#F4A281" radius={[6,6,0,0]} />
                    <Bar dataKey="exp" name="Expense" fill="#2D3553" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right column: Calendar and promo */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2, bgcolor: '#2D3553', color: '#E6E8EF', borderRadius: 3, width: 320, ml: 'auto', transition: 'box-shadow .2s, transform .2s', '&:hover': { boxShadow: '0 8px 24px rgba(45,53,83,0.24)', transform: 'translateY(-2px)' } }}>
            <CardContent sx={{ p: 2, height: 320 }}>
              <Typography variant="h6" fontWeight={700} mb={1} sx={{ color: '#fff' }}>Event Calendar</Typography>
              <Box display="flex" gap={1} mb={1}>
                <Button size="small" variant="contained" sx={{ bgcolor: '#F4A281', '&:hover': { bgcolor: '#e19272' } }}>Day to day</Button>
                {/* <Button size="small" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.5)', color: '#E6E8EF' }}>Social Media</Button> */}
              </Box>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={(v) => setSelectedDate(v)}
                    sx={{
                      '& .MuiPickersDay-root': { color: '#E6E8EF', width: 28, height: 28, fontSize: '0.75rem', m: '2px', borderRadius: 1.2, border: '1px solid rgba(230,232,239,0.18)' },
                      '& .MuiPickersDay-root.Mui-selected': { bgcolor: '#F4A281', color: '#2D3553' },
                      '& .MuiPickersDay-root.MuiPickersDay-today': { borderColor: '#F4A281' },
                      '& .MuiDayCalendar-weekDayLabel': { color: '#A9B1C7' },
                      '& .MuiPickersCalendarHeader-root': { mb: 0.5, p: 0 },
                      '& .MuiPickersCalendarHeader-label': { color: '#E6E8EF', fontSize: '0.85rem' },
                      '& .MuiPickersArrowSwitcher-button': { color: '#E6E8EF' },
                      '& .MuiDayCalendar-monthContainer': { my: 0 },
                      '& .MuiDayCalendar-weekContainer': { mx: 0 },
                    }}
                    slots={{ day: EventDay }}
                    slotProps={{ day: { highlightedDays } as any }}
                  />
                </LocalizationProvider>
              </Box>
              {/* Day events list */}
              <Box mt={1.5}>
                {eventsForSelected.length > 0 ? (
                  <List dense sx={{ color: '#E6E8EF' }}>
                    {eventsForSelected.map((e) => (
                      <ListItem key={e.title} sx={{ py: 0.5 }}>
                        <Chip
                          size="small"
                          label={e.category}
                          sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', textTransform: 'capitalize' }}
                        />
                        <ListItemText primary={e.title} primaryTypographyProps={{ sx: { color: '#E6E8EF' } }} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="caption" sx={{ color: '#A9B1C7' }}>No events on this day</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Attendance (left), Notice Board (middle), Students + Promo (right) */}
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, transition: 'box-shadow .2s, transform .2s', '&:hover': { boxShadow: '0 8px 24px rgba(45,53,83,0.12)', transform: 'translateY(-2px)' } }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={1}>Attendance</Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 1.5, bgcolor: '#F0FFF4', borderRadius: 2 }}>
                  <Avatar sx={{ bgcolor: '#16A34A' }}><CheckCircleIcon sx={{ color: '#fff' }} /></Avatar>
                  <Box>
                    <Typography fontWeight={700}>Present</Typography>
                    <Typography variant="body2" color="text.secondary">92% today</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 1.5, bgcolor: '#FFF1F2', borderRadius: 2 }}>
                  <Avatar sx={{ bgcolor: '#EF4444' }}><CancelIcon sx={{ color: '#fff' }} /></Avatar>
                  <Box>
                    <Typography fontWeight={700}>Absent</Typography>
                    <Typography variant="body2" color="text.secondary">5% today</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 1.5, bgcolor: '#FFF7ED', borderRadius: 2 }}>
                  <Avatar sx={{ bgcolor: '#F59E0B' }}><AccessTimeIcon sx={{ color: '#fff' }} /></Avatar>
                  <Box>
                    <Typography fontWeight={700}>Late</Typography>
                    <Typography variant="body2" color="text.secondary">3% today</Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, transition: 'box-shadow .2s, transform .2s', '&:hover': { boxShadow: '0 8px 24px rgba(45,53,83,0.12)', transform: 'translateY(-2px)' } }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="h6" fontWeight={700}>Notice Board</Typography>
                <IconButton size="small"><MoreHorizIcon /></IconButton>
              </Stack>
              <List>
                {[
                  { title: 'Inter-school competition (sports/singing/drawing/drama)', date: '10 Feb, 2023', avatar: 'IC' },
                  { title: 'Disciplinary action if school discipline is not followed', date: '6 Feb, 2023', avatar: 'DA' },
                  { title: 'School Annual function celebration 2023-24', date: '2 Feb, 2023', avatar: 'AF' },
                  { title: 'Returning library books timely (Usually pinned on notice...)', date: '31 Jan, 2023', avatar: 'LB' },
                ].map((item, i) => (
                  <React.Fragment key={item.title}>
                    <ListItem secondaryAction={<Chip label="7k" size="small" />}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar variant="rounded">{item.avatar}</Avatar>
                        <ListItemText primary={item.title} secondary={item.date} />
                      </Stack>
                    </ListItem>
                    {i !== 3 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2, borderRadius: 3, transition: 'box-shadow .2s, transform .2s', '&:hover': { boxShadow: '0 8px 24px rgba(45,53,83,0.12)', transform: 'translateY(-2px)' } }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="h6" fontWeight={700}>Students</Typography>
                <IconButton size="small"><MoreHorizIcon /></IconButton>
              </Stack>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box flex={1} height={160}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie dataKey="value" data={[{name:'Male',value:55},{name:'Female',value:45}]}
                           cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2}>
                        <Cell fill="#2D3553" />
                        <Cell fill="#F4A281" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box>
                  <Typography variant="body2">Male 55%</Typography>
                  <Typography variant="body2">Female 45%</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#FCE7F3', borderRadius: 3, transition: 'box-shadow .2s, transform .2s', '&:hover': { boxShadow: '0 8px 24px rgba(45,53,83,0.12)', transform: 'translateY(-2px)' } }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={1}>Join the community and find out more</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>Join different community and keep updated with the live notices and messages.</Typography>
              <Button variant="contained">Explore now</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

