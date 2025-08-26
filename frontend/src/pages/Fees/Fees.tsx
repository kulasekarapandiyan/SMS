import React, { useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid } from 'recharts';

type FeeRow = {
  id: string;
  student: string;
  class: string;
  tuition: number;
  activities: number;
  misc: number;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
};

const chartData = [
  { name: 'Jan', value: 25 },
  { name: 'Feb', value: 50 },
  { name: 'Mar', value: 10 },
  { name: 'Apr', value: 40 },
  { name: 'May', value: 12 },
  { name: 'Jun', value: 27 },
];

const seedRows: FeeRow[] = [
  { id: '1', student: 'Carla Bergson', class: '5C', tuition: 649, activities: 789, misc: 456, amount: 3000, status: 'Paid', date: '04/05/24' },
  { id: '2', student: 'Kaiya Saris', class: '4B', tuition: 134, activities: 987, misc: 567, amount: 2000, status: 'Paid', date: '06/07/24' },
  { id: '3', student: 'Michael Brown', class: '8B', tuition: 340, activities: 456, misc: 123, amount: 4000, status: 'Pending', date: '04/05/24' },
  { id: '4', student: 'Angel Vaccaro', class: '7A', tuition: 454, activities: 125, misc: 345, amount: 5000, status: 'Pending', date: '05/06/24' },
  { id: '5', student: 'Talan Calzoni', class: '6A', tuition: 321, activities: 908, misc: 689, amount: 6000, status: 'Overdue', date: '07/07/24' },
  { id: '6', student: 'Hanna Vetrows', class: '9B', tuition: 876, activities: 230, misc: 562, amount: 1000, status: 'Overdue', date: '08/05/24' },
];

const money = (v: number) => `$${v.toLocaleString()}`;

const Fees: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    return seedRows.filter(r => r.student.toLowerCase().includes(q) || r.class.toLowerCase().includes(q));
  }, [search]);

  const toggleSelectAll = (checked: boolean) => setSelected(checked ? filteredRows.map(r => r.id) : []);
  const toggleRow = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const generateCSV = () => {
    const header = ['Student Name', 'Class', 'Tuition Fee', 'Activities Fee', 'Miscellaneous', 'Amount', 'Status', 'Date'];
    const rows = filteredRows.map(r => [r.student, r.class, r.tuition, r.activities, r.misc, r.amount, r.status, r.date]);
    const csv = [header, ...rows].map(line => line.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'fees_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Fees</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={7}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={700}>Fees Collection</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip size="small" label="Class 7B" />
                  <Chip size="small" label="Monthly" />
                </Stack>
              </Stack>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid vertical={false} stroke="#ECEEF3" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2D4A3A" radius={[8, 8, 0, 0]} barSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={5}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={12}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Chip icon={<TrendingUpIcon />} color="success" label="15%" size="small" variant="outlined" />
                    <Box>
                      <Typography variant="h5" fontWeight={800}>$60,785</Typography>
                      <Typography variant="caption" color="text.secondary">Total Amount</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Chip icon={<TrendingUpIcon />} color="success" label="18%" size="small" variant="outlined" />
                    <Box>
                      <Typography variant="h5" fontWeight={800}>$22,580</Typography>
                      <Typography variant="caption" color="text.secondary">Total Tuition</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Chip icon={<TrendingDownIcon />} color="error" label="8%" size="small" variant="outlined" />
                    <Box>
                      <Typography variant="h5" fontWeight={800}>$6,345</Typography>
                      <Typography variant="caption" color="text.secondary">Total Activities</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Chip icon={<TrendingDownIcon />} color="error" label="6%" size="small" variant="outlined" />
                    <Box>
                      <Typography variant="h5" fontWeight={800}>$12,345</Typography>
                      <Typography variant="caption" color="text.secondary">Total Miscellaneous</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* List of Fees Collection */}
      <Card sx={{ mt: 3, borderRadius: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>List of Fees Collection</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField size="small" placeholder="Search name..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
              <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={generateCSV}>Generate Report</Button>
            </Stack>
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
                  <TableCell>Student Name</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Tuition Fee</TableCell>
                  <TableCell>Activities Fee</TableCell>
                  <TableCell>Miscellaneous</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell padding="checkbox"><Checkbox checked={selected.includes(r.id)} onChange={() => toggleRow(r.id)} /></TableCell>
                    <TableCell>{r.student}</TableCell>
                    <TableCell>{r.class}</TableCell>
                    <TableCell>{money(r.tuition)}</TableCell>
                    <TableCell>{money(r.activities)}</TableCell>
                    <TableCell>{money(r.misc)}</TableCell>
                    <TableCell>{money(r.amount)}</TableCell>
                    <TableCell>
                      {r.status === 'Paid' && <Chip label="Paid" color="success" size="small" variant="outlined" />}
                      {r.status === 'Pending' && <Chip label="Pending" color="warning" size="small" variant="outlined" />}
                      {r.status === 'Overdue' && <Chip label="Overdue" color="error" size="small" variant="outlined" />}
                    </TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" aria-label="edit">
                        {/* Placeholder for row action icons */}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Fees;


