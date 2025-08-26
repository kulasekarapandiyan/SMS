import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Grid,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SavingsIcon from '@mui/icons-material/Savings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import GroupsIcon from '@mui/icons-material/Groups';
import BookIcon from '@mui/icons-material/Book';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

type FeeType = 'tuition' | 'lab' | 'library' | 'exam' | 'transport' | 'sports' | 'activity' | 'uniform';

const feeTypes: Array<{ id: FeeType; name: string; description: string; color: string }> = [
  { id: 'tuition', name: 'Tuition Fee', description: 'Monthly/term tuition charges', color: '#6366F1' },
  { id: 'lab', name: 'Laboratory Fee', description: 'Science lab usage and materials', color: '#0EA5E9' },
  { id: 'library', name: 'Library Fee', description: 'Library access and book deposits', color: '#10B981' },
  { id: 'exam', name: 'Examination Fee', description: 'Exam registration and materials', color: '#DB2777' },
  { id: 'transport', name: 'Transportation', description: 'School bus and transport', color: '#F59E0B' },
  { id: 'sports', name: 'Sports Fee', description: 'Sports activities and equipment', color: '#22C55E' },
  { id: 'activity', name: 'Activity Fee', description: 'Extracurricular activities', color: '#EF4444' },
  { id: 'uniform', name: 'Uniform Fee', description: 'School uniform and accessories', color: '#6366F1' },
];

const classesSeed = [
  { id: 'grade-12-a', name: 'Grade 12-A', students: 32, section: 'Science' },
  { id: 'grade-12-b', name: 'Grade 12-B', students: 28, section: 'Commerce' },
  { id: 'grade-11-a', name: 'Grade 11-A', students: 30, section: 'Science' },
  { id: 'grade-11-b', name: 'Grade 11-B', students: 26, section: 'Arts' },
  { id: 'grade-10-a', name: 'Grade 10-A', students: 34, section: 'General' },
];

const paymentMethodOptions = [
  { id: 'online', name: 'Online Payment', icon: <CreditCardIcon fontSize="small" /> },
  { id: 'cash', name: 'Cash Payment', icon: <AttachMoneyIcon fontSize="small" /> },
  { id: 'bank', name: 'Bank Transfer', icon: <SavingsIcon fontSize="small" /> },
  { id: 'check', name: 'Check Payment', icon: <BookIcon fontSize="small" /> },
];

const AddIncome: React.FC = () => {
  const navigate = useNavigate();
  const [feeName, setFeeName] = useState('');
  const [description, setDescription] = useState('');
  const [feeType, setFeeType] = useState<FeeType>('tuition');
  const [amount, setAmount] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  const [lateFeePenalty, setLateFeePenalty] = useState('');
  const [lateFeeType, setLateFeeType] = useState<'fixed' | 'percentage'>('fixed');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPeriod, setRecurringPeriod] = useState<'weekly' | 'monthly' | 'quarterly' | 'annually'>('monthly');
  const [assignmentType, setAssignmentType] = useState<'class' | 'student'>('class');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>(['online', 'cash']);
  const [notes, setNotes] = useState('');

  const totalStudents = useMemo(() => selectedClasses.reduce((total, id) => total + (classesSeed.find(c => c.id === id)?.students || 0), 0), [selectedClasses]);
  const estimatedTotal = useMemo(() => totalStudents * (parseFloat(amount) || 0), [totalStudents, amount]);

  const toggleClass = (id: string) => {
    setSelectedClasses(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const togglePayment = (id: string) => {
    setPaymentMethods(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/income');
  };

  const typeMeta = feeTypes.find(t => t.id === feeType)!;

  return (
    <Box component="form" onSubmit={submit}>
      {/* Breadcrumb */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Button component={RouterLink} to="/income" startIcon={<ArrowBackIosNewIcon />} color="inherit">Back to Income</Button>
      </Stack>

      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>Add New Income</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Create a new income/fee and assign it to classes or students.</Typography>

      {/* Preview */}
      <Card sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Stack alignItems="center" justifyContent="center" sx={{ width: 36, height: 36, borderRadius: 1, background: typeMeta.color, color: '#fff' }}>
                <AttachMoneyIcon fontSize="small" />
              </Stack>
              <Chip label={typeMeta.name} variant="outlined" sx={{ borderColor: `${typeMeta.color}55`, color: typeMeta.color, bgcolor: '#fff' }} />
            </Stack>
          </Stack>
          <Typography variant="h6" fontWeight={800}>{feeName || 'Fee Name'}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{description || 'Fee description will appear here'}</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}><Typography variant="caption" color="text.secondary">Amount</Typography><Typography fontWeight={700}>${amount || '0'}</Typography></Grid>
            <Grid item xs={6}><Typography variant="caption" color="text.secondary">Due Date</Typography><Typography fontWeight={600}>{dueDate || 'Not set'}</Typography></Grid>
            <Grid item xs={6}><Typography variant="caption" color="text.secondary">Students</Typography><Typography fontWeight={600}>{totalStudents}</Typography></Grid>
            <Grid item xs={6}><Typography variant="caption" color="text.secondary">Est. Total</Typography><Typography fontWeight={800} color="success.main">${estimatedTotal.toLocaleString()}</Typography></Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>Basic Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><TextField label="Fee Name" value={feeName} onChange={(e) => setFeeName(e.target.value)} fullWidth required /></Grid>
            <Grid item xs={12} md={6}><TextField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" fullWidth InputProps={{ startAdornment: (<InputAdornment position="start">$</InputAdornment>) }} required /></Grid>
            <Grid item xs={12}><TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline minRows={3} /></Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Fee Type</Typography>
              <Grid container spacing={1} sx={{ mt: 0.5 }}>
                {feeTypes.map((t) => (
                  <Grid item key={t.id} xs={12} sm={6} md={3}>
                    <Card onClick={() => setFeeType(t.id)} sx={{ cursor: 'pointer', border: feeType === t.id ? `2px solid ${t.color}` : '1px solid #E5E7EB' }}>
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography fontWeight={600}>{t.name}</Typography>
                          {feeType === t.id && <CheckCircleOutlineIcon sx={{ color: t.color }} fontSize="small" />}
                        </Stack>
                        <Typography variant="caption" color="text.secondary">{t.description}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Due date & penalties */}
      <Card sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>Due Date & Penalties</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><TextField label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1}>
                <TextField label="Late Fee Penalty" type="number" value={lateFeePenalty} onChange={(e) => setLateFeePenalty(e.target.value)} fullWidth />
                <Select value={lateFeeType} onChange={(e) => setLateFeeType(e.target.value as any)} size="small">
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                  <MenuItem value="percentage">Percentage</MenuItem>
                </Select>
              </Stack>
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <FormControlLabel control={<Checkbox checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} />} label="Recurring Fee" />
            {isRecurring && (
              <Select value={recurringPeriod} onChange={(e) => setRecurringPeriod(e.target.value as any)} size="small">
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="annually">Annually</MenuItem>
              </Select>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Assign to classes */}
      <Card sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>Assign to Classes</Typography>
          <Grid container spacing={1}>
            {classesSeed.map((c) => (
              <Grid item xs={12} sm={6} md={4} key={c.id}>
                <Card onClick={() => toggleClass(c.id)} sx={{ cursor: 'pointer', border: selectedClasses.includes(c.id) ? '2px solid #10B981' : '1px solid #E5E7EB' }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography fontWeight={600}>{c.name}</Typography>
                      {selectedClasses.includes(c.id) && <CheckCircleOutlineIcon color="success" fontSize="small" />}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">{c.section}</Typography>
                    <Typography variant="caption" color="text.secondary">{c.students} students</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {selectedClasses.length > 0 && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>Assignment Summary</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}><Typography variant="caption" color="text.secondary">Selected Classes</Typography><Typography fontWeight={700}>{selectedClasses.length}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="caption" color="text.secondary">Total Students</Typography><Typography fontWeight={700}>{totalStudents}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="caption" color="text.secondary">Fee per Student</Typography><Typography fontWeight={700}>${amount || '0'}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="caption" color="text.secondary">Estimated Total</Typography><Typography fontWeight={800} color="success.main">${estimatedTotal.toLocaleString()}</Typography></Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Payment options */}
      <Card sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>Payment Options</Typography>
          <Grid container spacing={1}>
            {paymentMethodOptions.map((m) => (
              <Grid item xs={6} sm={3} key={m.id}>
                <Card onClick={() => togglePayment(m.id)} sx={{ cursor: 'pointer', border: paymentMethods.includes(m.id) ? '2px solid #DB2777' : '1px solid #E5E7EB' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    {m.icon}
                    <Typography variant="caption" sx={{ mt: 0.5 }}>{m.name}</Typography>
                    {paymentMethods.includes(m.id) && <CheckCircleOutlineIcon color="secondary" fontSize="small" />}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Additional notes */}
      <Card sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>Additional Information</Typography>
          <TextField label="Notes & Instructions" value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth multiline minRows={4} />
        </CardContent>
      </Card>

      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button variant="outlined" color="inherit" component={RouterLink} to="/income">Cancel</Button>
        <Button type="submit" variant="contained">Create Income</Button>
      </Stack>
    </Box>
  );
};

export default AddIncome;


