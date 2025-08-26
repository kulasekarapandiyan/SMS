import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import SearchIcon from '@mui/icons-material/Search';
import { Link as RouterLink } from 'react-router-dom';

const metrics = [
  { title: 'Total Income', value: '$284,750', change: '+12.5%', icon: <TrendingUpIcon />, chipColor: 'success' as const },
  { title: 'Pending Invoices', value: '$45,320', change: '-8.2%', icon: <AccessTimeIcon />, chipColor: 'warning' as const },
  { title: 'Overdue Amounts', value: '$12,850', change: '+3.1%', icon: <CheckCircleOutlineIcon />, chipColor: 'error' as const },
  { title: 'Active Students', value: '2,847', change: '+2.1%', icon: <PeopleAltIcon />, chipColor: 'info' as const },
];

const monthly = [
  { month: 'Jan', collected: 85 },
  { month: 'Feb', collected: 92 },
  { month: 'Mar', collected: 88 },
  { month: 'Apr', collected: 95 },
  { month: 'May', collected: 90 },
  { month: 'Jun', collected: 87 },
];

const activities = [
  { who: 'Sarah Johnson', description: 'Grade 10-A', amount: 1250, status: 'paid' },
  { who: 'Michael Chen', description: 'Grade 9-B', amount: 850, status: 'paid' },
  { who: 'Emily Rodriguez', description: 'Grade 11-A', amount: 1350, status: 'pending' },
  { who: 'Alex Thompson', description: 'Grade 8-C', amount: 750, status: 'overdue' },
];

const Income: React.FC = () => {
  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 2, borderRadius: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack alignItems="center" justifyContent="center" sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: '#fff' }}>
                <SchoolIcon />
              </Stack>
              <Box>
                <Typography variant="caption" color="text.secondary">Income Management</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Button component={RouterLink} to="/income/add" variant="contained" size="small" startIcon={<AddIcon />}>Add Income</Button>
              <Button variant="outlined" size="small">View Reports</Button>
              <Stack alignItems="center" justifyContent="center" sx={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #DB2777, #BE185D)', color: '#fff', fontSize: 12, fontWeight: 700 }}>JD</Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Breadcrumb */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Button component={RouterLink} to="/dashboard" startIcon={<ArrowBackIosNewIcon />} color="inherit">Back to Dashboard</Button>
      </Stack>

      {/* Page Title */}
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>Income Management</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Monitor income, track payments, and manage billing.</Typography>

      {/* Metrics */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {metrics.map((m) => (
          <Grid key={m.title} item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Stack alignItems="center" justifyContent="center" sx={{ width: 36, height: 36, borderRadius: 1, background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: '#fff' }}>
                    {m.icon}
                  </Stack>
                  <Chip size="small" color={m.chipColor} label={m.change} variant="filled" />
                </Stack>
                <Typography variant="h5" fontWeight={800}>{m.value}</Typography>
                <Typography variant="caption" color="text.secondary">{m.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      

      {/* Charts and Recent Activities */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <BarChartIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={700}>Monthly Income</Typography>
              </Stack>
              <Stack spacing={1.5}>
                {monthly.map((d) => (
                  <Box key={d.month}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" fontWeight={600}>{d.month}</Typography>
                      <Typography variant="caption" color="text.secondary">{d.collected}%</Typography>
                    </Stack>
                    <Box sx={{ mt: 0.5, height: 10, bgcolor: '#E5E7EB', borderRadius: 1 }}>
                      <Box sx={{ height: '100%', width: `${d.collected}%`, bgcolor: '#10B981', borderRadius: 1 }} />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <TimelineIcon color="secondary" />
                <Typography variant="subtitle1" fontWeight={700}>Recent Activities</Typography>
                <Box sx={{ ml: 'auto' }}>
                  <TextField size="small" placeholder="Search..." InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} />
                </Box>
              </Stack>
              <Stack spacing={1.5}>
                {activities.map((a, idx) => (
                  <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1, border: '1px solid #F1F5F9', borderRadius: 1 }}>
                    <Box>
                      <Typography fontWeight={600}>{a.who}</Typography>
                      <Typography variant="caption" color="text.secondary">{a.description}</Typography>
                    </Box>
                    <Stack alignItems="flex-end">
                      <Typography fontWeight={700}>${a.amount}</Typography>
                      <Chip size="small" label={a.status} color={a.status === 'paid' ? 'success' : a.status === 'pending' ? 'warning' : 'error'} variant="outlined" />
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
        <Button variant="outlined">View Reports</Button>
      </Stack>
    </Box>
  );
};

export default Income;


