import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Checkbox,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

type TeacherRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  klass: string;
  status: 'Active' | 'Inactive';
};

const seed: TeacherRow[] = [
  { id: 1, name: 'Carla Peter', email: 'carla.peter@gmail.com', phone: '+88 9856418', subject: 'Maths', klass: '5th', status: 'Active' },
  { id: 2, name: 'Jason Black', email: 'jason.black@example.com', phone: '+88 4567891', subject: 'English', klass: '7th', status: 'Active' },
  { id: 3, name: 'Mary Byrd', email: 'mary.byrd@example.com', phone: '+88 2345678', subject: 'Chemistry', klass: '4th', status: 'Inactive' },
  { id: 4, name: 'Delbert Barna', email: 'delbert.barna@example.com', phone: '+88 1357924', subject: 'Physics', klass: '6th', status: 'Active' },
];

const avatarColors = ['#8B5CF6','#F59E0B','#10B981','#EF4444','#3B82F6','#E11D48','#22C55E','#F97316'];
const colorFor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length];

const TeacherList: React.FC = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<TeacherRow[]>(seed);
  const [selected, setSelected] = useState<number[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id?: number }>({ open: false });

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return rows.filter(r => r.name.toLowerCase().includes(query) || r.email.toLowerCase().includes(query) || r.subject.toLowerCase().includes(query));
  }, [q, rows]);

  const toggleSelectAll = (checked: boolean) => setSelected(checked ? filtered.map(r => r.id) : []);
  const toggleRow = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleDelete = (id: number) => {
    setConfirmDelete({ open: true, id });
  };
  const confirmDeletion = () => {
    if (confirmDelete.id !== undefined) {
      setRows(prev => prev.filter(r => r.id !== confirmDelete.id));
    }
    setConfirmDelete({ open: false });
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Teachers</Typography>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => navigate('/teachers/add')}>Add Teacher</Button>
      </Stack>

      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>Teachers List</Typography>
            <TextField size="small" placeholder="Search by name, email or subject" value={q} onChange={(e) => setQ(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} />
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"><Checkbox checked={selected.length>0 && selected.length===filtered.length} indeterminate={selected.length>0 && selected.length<filtered.length} onChange={(e)=>toggleSelectAll(e.target.checked)} /></TableCell>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id} hover>
                    <TableCell padding="checkbox"><Checkbox checked={selected.includes(r.id)} onChange={()=>toggleRow(r.id)} /></TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 28, height: 28, bgcolor: colorFor(r.name), color: '#fff', fontSize: 14, fontWeight: 700 }}>{r.name[0]}</Avatar>
                        <Typography>{r.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell>{r.phone}</TableCell>
                    <TableCell>{r.subject}</TableCell>
                    <TableCell>{r.klass}</TableCell>
                    <TableCell>
                      {r.status === 'Active' ? <Chip label="Active" color="success" size="small" variant="outlined" /> : <Chip label="Inactive" size="small" variant="outlined" />}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => navigate(`/teachers/${r.id}`)}><VisibilityIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => navigate(`/teachers/${r.id}/edit`)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDelete(r.id)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false })}>
        <DialogTitle>Delete teacher?</DialogTitle>
        <DialogContent>This action cannot be undone.</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false })}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDeletion}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherList;


