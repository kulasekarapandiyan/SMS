import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Stack,
  Button,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  LinearProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Tooltip,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  FileCopy as FileCopyIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  EmojiEvents as EmojiEventsIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  School as SchoolIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Star as StarIcon,
  BarChart as BarChartIcon,
  School as GraduationCap,
  TrendingUp as Target,
  Psychology as Brain,
  Favorite as Heart,
  Work as Briefcase,
  CalendarMonth as Calendar,
  AccessTime as Clock,
  EmojiEvents as Award,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  FilterAlt as FilterAltIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface Teacher {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  department: string;
  specialization: string[];
  hireDate: string;
  qualification: string;
  experience: number;
  status: "active" | "on-leave" | "part-time" | "substitute";
  rating: number;
  totalStudents: number;
  classesAssigned: string[];
  subjectsTeaching: string[];
  workloadHours: number;
  maxWorkload: number;
  achievements: string[];
  lastActivity: string;
  salary: number;
  address: string;
  emergencyContact: string;
  performanceScore: number;
}

const teacherStats = [
  {
    title: "Total Teachers",
    value: "87",
    change: "+3",
    changeType: "positive" as const,
    icon: PeopleIcon,
    color: "#2563eb",
    bgColor: "#eff6ff",
  },
  {
    title: "New Hires",
    value: "5",
    change: "+2",
    changeType: "positive" as const,
    icon: PersonAddIcon,
    color: "#059669",
    bgColor: "#ecfdf5",
  },
  {
    title: "Average Rating",
    value: "4.7",
    change: "+0.2",
    changeType: "positive" as const,
    icon: EmojiEventsIcon,
    color: "#d97706",
    bgColor: "#fef3c7",
  },
  {
    title: "Workload Balance",
    value: "92%",
    change: "+1.5%",
    changeType: "positive" as const,
    icon: Target,
    color: "#7c3aed",
    bgColor: "#f3e8ff",
  },
];

const teachers: Teacher[] = [
  {
    id: 1,
    employeeId: "TCH2024001",
    name: "Dr. Sarah Wilson",
    email: "sarah.wilson@school.edu",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg",
    department: "Mathematics",
    specialization: ["Advanced Calculus", "Statistics", "Algebra"],
    hireDate: "2019-08-15",
    qualification: "Ph.D. in Mathematics",
    experience: 8,
    status: "active",
    rating: 4.9,
    totalStudents: 156,
    classesAssigned: ["Grade 12A", "Grade 12B", "Grade 11A"],
    subjectsTeaching: ["Advanced Mathematics", "Statistics", "Pre-Calculus"],
    workloadHours: 24,
    maxWorkload: 30,
    achievements: [
      "Teacher of the Year 2023",
      "Excellence in STEM",
      "Research Publication",
    ],
    lastActivity: "2024-03-15",
    salary: 75000,
    address: "123 Oak Street, Springfield, IL",
    emergencyContact: "+1 (555) 123-4568",
    performanceScore: 96,
  },
  {
    id: 2,
    employeeId: "TCH2024002",
    name: "Prof. James Chen",
    email: "james.chen@school.edu",
    phone: "+1 (555) 234-5678",
    avatar: "/placeholder.svg",
    department: "Physics",
    specialization: [
      "Quantum Physics",
      "Thermodynamics",
      "Laboratory Techniques",
    ],
    hireDate: "2020-01-10",
    qualification: "M.Sc. Physics, Ph.D. in Quantum Mechanics",
    experience: 6,
    status: "active",
    rating: 4.8,
    totalStudents: 134,
    classesAssigned: ["Grade 11B", "Grade 12A"],
    subjectsTeaching: ["Physics", "Advanced Physics", "Lab Physics"],
    workloadHours: 22,
    maxWorkload: 28,
    achievements: [
      "Innovation in Teaching",
      "Science Fair Coordinator",
      "Student Mentor Award",
    ],
    lastActivity: "2024-03-14",
    salary: 68000,
    address: "456 Pine Avenue, Springfield, IL",
    emergencyContact: "+1 (555) 234-5679",
    performanceScore: 94,
  },
  {
    id: 3,
    employeeId: "TCH2024003",
    name: "Ms. Emily Rodriguez",
    email: "emily.rodriguez@school.edu",
    phone: "+1 (555) 345-6789",
    avatar: "/placeholder.svg",
    department: "English",
    specialization: ["Literature", "Creative Writing", "Public Speaking"],
    hireDate: "2021-03-22",
    qualification: "M.A. English Literature",
    experience: 4,
    status: "active",
    rating: 4.7,
    totalStudents: 178,
    classesAssigned: ["Grade 10A", "Grade 10B", "Grade 9A"],
    subjectsTeaching: [
      "English Literature",
      "Creative Writing",
      "Communication Skills",
    ],
    workloadHours: 26,
    maxWorkload: 30,
    achievements: [
      "Creative Writing Champion",
      "Drama Club Director",
      "Literary Magazine Editor",
    ],
    lastActivity: "2024-03-15",
    salary: 58000,
    address: "789 Elm Road, Springfield, IL",
    emergencyContact: "+1 (555) 345-6790",
    performanceScore: 92,
  },
  {
    id: 4,
    employeeId: "TCH2024004",
    name: "Mr. David Kim",
    email: "david.kim@school.edu",
    phone: "+1 (555) 456-7890",
    avatar: "/placeholder.svg",
    department: "Computer Science",
    specialization: ["Programming", "Web Development", "Robotics"],
    hireDate: "2022-08-01",
    qualification: "M.S. Computer Science",
    experience: 3,
    status: "active",
    rating: 4.6,
    totalStudents: 145,
    classesAssigned: ["Grade 12A", "Grade 11B"],
    subjectsTeaching: ["Computer Science", "Programming", "Web Development"],
    workloadHours: 20,
    maxWorkload: 25,
    achievements: [
      "Tech Innovation Award",
      "Coding Club Mentor",
      "Robotics Team Coach",
    ],
    lastActivity: "2024-03-13",
    salary: 62000,
    address: "321 Maple Lane, Springfield, IL",
    emergencyContact: "+1 (555) 456-7891",
    performanceScore: 89,
  },
  {
    id: 5,
    employeeId: "TCH2024005",
    name: "Dr. Maria Santos",
    email: "maria.santos@school.edu",
    phone: "+1 (555) 567-8901",
    avatar: "/placeholder.svg",
    department: "Biology",
    specialization: ["Cell Biology", "Genetics", "Ecology"],
    hireDate: "2018-09-12",
    qualification: "Ph.D. in Biology",
    experience: 10,
    status: "active",
    rating: 4.8,
    totalStudents: 162,
    classesAssigned: ["Grade 11A", "Grade 10A", "Grade 9B"],
    subjectsTeaching: ["Biology", "Advanced Biology", "Environmental Science"],
    workloadHours: 25,
    maxWorkload: 30,
    achievements: [
      "Research Excellence",
      "Environmental Club Advisor",
      "Science Olympiad Coach",
    ],
    lastActivity: "2024-03-15",
    salary: 72000,
    address: "654 Cedar Street, Springfield, IL",
    emergencyContact: "+1 (555) 567-8902",
    performanceScore: 95,
  },
  {
    id: 6,
    employeeId: "TCH2024006",
    name: "Ms. Sophie Turner",
    email: "sophie.turner@school.edu",
    phone: "+1 (555) 678-9012",
    avatar: "/placeholder.svg",
    department: "Arts",
    specialization: ["Visual Arts", "Digital Design", "Art History"],
    hireDate: "2023-01-15",
    qualification: "M.F.A. Visual Arts",
    experience: 2,
    status: "active",
    rating: 4.9,
    totalStudents: 89,
    classesAssigned: ["Grade 9A", "Grade 9B"],
    subjectsTeaching: ["Art & Design", "Digital Arts", "Art History"],
    workloadHours: 18,
    maxWorkload: 24,
    achievements: [
      "Young Artist Mentor",
      "Art Exhibition Organizer",
      "Student Inspiration Award",
    ],
    lastActivity: "2024-03-14",
    salary: 52000,
    address: "987 Birch Avenue, Springfield, IL",
    emergencyContact: "+1 (555) 678-9013",
    performanceScore: 91,
  },
];

const departments = [
  "All Departments",
  "Mathematics",
  "Physics",
  "English",
  "Computer Science",
  "Biology",
  "Arts",
  "History",
  "Chemistry",
];

const statuses = [
  "All Status",
  "active",
  "on-leave",
  "part-time",
  "substitute",
];

export default function Teachers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isTeacherDetailsOpen, setIsTeacherDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTeacherForMenu, setSelectedTeacherForMenu] = useState<Teacher | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization.some((spec) =>
        spec.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      teacher.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "All Status" || teacher.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Chip
            label="Active"
            size="small"
            sx={{
              backgroundColor: '#ecfdf5',
              color: '#059669',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#ecfdf5' }
            }}
          />
        );
      case "on-leave":
        return (
          <Chip
            label="On Leave"
            size="small"
            variant="outlined"
            sx={{
              borderColor: '#fbbf24',
              color: '#d97706',
              fontWeight: 600
            }}
          />
        );
      case "part-time":
        return (
          <Chip
            label="Part Time"
            size="small"
            sx={{
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#eff6ff' }
            }}
          />
        );
      case "substitute":
        return (
          <Chip
            label="Substitute"
            size="small"
            variant="outlined"
            sx={{
              borderColor: '#c084fc',
              color: '#7c3aed',
              fontWeight: 600
            }}
          />
        );
      default:
        return <Chip label={status} size="small" variant="outlined" />;
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "#059669";
    if (rating >= 4.0) return "#2563eb";
    if (rating >= 3.5) return "#d97706";
    return "#dc2626";
  };

  const getWorkloadColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return "#dc2626";
    if (percentage >= 75) return "#d97706";
    return "#059669";
  };

  const handleTeacherSelect = (teacherId: number, checked: boolean) => {
    if (checked) {
      setSelectedTeachers([...selectedTeachers, teacherId]);
    } else {
      setSelectedTeachers(selectedTeachers.filter((id) => id !== teacherId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTeachers(filteredTeachers.map((t) => t.id));
    } else {
      setSelectedTeachers([]);
    }
  };

  const openTeacherDetails = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsTeacherDetailsOpen(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, teacher: Teacher) => {
    setAnchorEl(event.currentTarget);
    setSelectedTeacherForMenu(teacher);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTeacherForMenu(null);
  };

  const handleViewTeacher = () => {
    if (selectedTeacherForMenu) {
      navigate(`/teachers/${selectedTeacherForMenu.id}`);
    }
    handleMenuClose();
  };

  const handleEditTeacher = () => {
    if (selectedTeacherForMenu) {
      navigate(`/teachers/${selectedTeacherForMenu.id}/edit`);
    }
    handleMenuClose();
  };

  const handleDeleteTeacher = () => {
    // Handle delete logic here
    handleMenuClose();
  };

  const handleAddTeacher = () => {
    navigate('/teachers/add');
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Teachers Management
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Manage your teaching staff, their profiles, and performance
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {teacherStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 2px 12px rgba(45,53,83,0.06)',
              border: '1px solid #e2e8f0'
            }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: stat.color, mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                      {stat.title}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      {stat.changeType === "positive" ? (
                        <TrendingUpIcon sx={{ color: '#059669', fontSize: 16 }} />
                      ) : (
                        <TrendingDownIcon sx={{ color: '#dc2626', fontSize: 16 }} />
                      )}
                      <Typography variant="caption" sx={{ 
                        color: stat.changeType === "positive" ? '#059669' : '#dc2626',
                        fontWeight: 600 
                      }}>
                        {stat.change}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 3, 
                    bgcolor: stat.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <stat.icon sx={{ fontSize: 32, color: stat.color }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(45,53,83,0.06)', border: '1px solid #e2e8f0' }}>
        <CardContent>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: '#e2e8f0', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ 
              '& .MuiTab-root': { 
                textTransform: 'none', 
                fontWeight: 600,
                minHeight: 48,
                color: '#64748b'
              },
              '& .Mui-selected': { 
                color: '#2563eb',
                fontWeight: 700
              },
              '& .MuiTabs-indicator': { 
                backgroundColor: '#2563eb',
                height: 3
              }
            }}>
              <Tab label="All Teachers" />
              <Tab label="Active" />
              <Tab label="On Leave" />
              <Tab label="Part Time" />
              <Tab label="Substitute" />
            </Tabs>
          </Box>

          {/* Filters and Actions */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#64748b' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { borderColor: '#e2e8f0' },
                      '&:hover fieldset': { borderColor: '#cbd5e1' },
                      '&.Mui-focused fieldset': { borderColor: '#2563eb' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    label="Department"
                    sx={{
                      borderRadius: 2,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' }
                    }}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    label="Status"
                    sx={{
                      borderRadius: 2,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' }
                    }}
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant={viewMode === "table" ? "contained" : "outlined"}
                    onClick={() => setViewMode("table")}
                    sx={{ 
                      minWidth: 'auto', 
                      px: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    <ViewListIcon />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "contained" : "outlined"}
                    onClick={() => setViewMode("grid")}
                    sx={{ 
                      minWidth: 'auto', 
                      px: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    <ViewModuleIcon />
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddTeacher}
                  sx={{
                    bgcolor: '#2563eb',
                    color: 'white',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#1d4ed8' }
                  }}
                >
                  Add Teacher
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Bulk Actions */}
          {selectedTeachers.length > 0 && (
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f1f5f9', borderRadius: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {selectedTeachers.length} teacher(s) selected
                </Typography>
                <Button
                  size="small"
                  startIcon={<DownloadIcon />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Export
                </Button>
                <Button
                  size="small"
                  startIcon={<DeleteIcon />}
                  color="error"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          )}

          {/* Teachers List */}
          {viewMode === "table" ? (
            <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedTeachers.length === filteredTeachers.length}
                        indeterminate={selectedTeachers.length > 0 && selectedTeachers.length < filteredTeachers.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        sx={{ color: '#64748b' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Teacher</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Rating</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Workload</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Students</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id} hover sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedTeachers.includes(teacher.id)}
                          onChange={(e) => handleTeacherSelect(teacher.id, e.target.checked)}
                          sx={{ color: '#64748b' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar src={teacher.avatar} sx={{ width: 40, height: 40 }}>
                            {teacher.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                              {teacher.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              {teacher.employeeId}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={teacher.department}
                          size="small"
                          sx={{
                            bgcolor: '#f1f5f9',
                            color: '#475569',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(teacher.status)}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <StarIcon sx={{ color: getRatingColor(teacher.rating), fontSize: 16 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                            {teacher.rating}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ minWidth: 100 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              {teacher.workloadHours}/{teacher.maxWorkload}h
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              color: getWorkloadColor(teacher.workloadHours, teacher.maxWorkload),
                              fontWeight: 600
                            }}>
                              {Math.round((teacher.workloadHours / teacher.maxWorkload) * 100)}%
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={(teacher.workloadHours / teacher.maxWorkload) * 100}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: '#e2e8f0',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: getWorkloadColor(teacher.workloadHours, teacher.maxWorkload)
                              }
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                          {teacher.totalStudents}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            onClick={() => openTeacherDetails(teacher)}
                            sx={{ color: '#2563eb' }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/teachers/${teacher.id}/edit`)}
                            sx={{ color: '#059669' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, teacher)}
                            sx={{ color: '#64748b' }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Grid container spacing={3}>
              {filteredTeachers.map((teacher) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={teacher.id}>
                  <Card sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 2px 12px rgba(45,53,83,0.06)',
                    border: '1px solid #e2e8f0',
                    height: '100%',
                    '&:hover': { 
                      boxShadow: '0 4px 20px rgba(45,53,83,0.12)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}>
                    <CardContent>
                      <Stack spacing={2}>
                        {/* Header */}
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Checkbox
                            checked={selectedTeachers.includes(teacher.id)}
                            onChange={(e) => handleTeacherSelect(teacher.id, e.target.checked)}
                            sx={{ color: '#64748b' }}
                          />
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, teacher)}
                            sx={{ color: '#64748b' }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Stack>

                        {/* Avatar and Name */}
                        <Stack alignItems="center" spacing={1}>
                          <Avatar src={teacher.avatar} sx={{ width: 64, height: 64 }}>
                            {teacher.name.charAt(0)}
                          </Avatar>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', textAlign: 'center' }}>
                            {teacher.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b', textAlign: 'center' }}>
                            {teacher.employeeId}
                          </Typography>
                        </Stack>

                        {/* Department and Status */}
                        <Stack spacing={1}>
                          <Chip
                            label={teacher.department}
                            size="small"
                            sx={{
                              bgcolor: '#f1f5f9',
                              color: '#475569',
                              fontWeight: 500
                            }}
                          />
                          {getStatusBadge(teacher.status)}
                        </Stack>

                        {/* Rating and Workload */}
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <StarIcon sx={{ color: getRatingColor(teacher.rating), fontSize: 16 }} />
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                {teacher.rating}
                              </Typography>
                            </Stack>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              {teacher.workloadHours}/{teacher.maxWorkload}h
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={(teacher.workloadHours / teacher.maxWorkload) * 100}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              bgcolor: '#e2e8f0',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: getWorkloadColor(teacher.workloadHours, teacher.maxWorkload)
                              }
                            }}
                          />
                        </Stack>

                        {/* Students and Actions */}
                        <Stack spacing={1}>
                          <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center' }}>
                            {teacher.totalStudents} students
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<VisibilityIcon />}
                              onClick={() => openTeacherDetails(teacher)}
                              sx={{ 
                                flex: 1,
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2
                              }}
                            >
                              View
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<EditIcon />}
                              onClick={() => navigate(`/teachers/${teacher.id}/edit`)}
                              sx={{ 
                                flex: 1,
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2
                              }}
                            >
                              Edit
                            </Button>
                          </Stack>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Teacher Details Dialog */}
      <Dialog
        open={isTeacherDetailsOpen}
        onClose={() => setIsTeacherDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Teacher Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedTeacher && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Stack alignItems="center" spacing={2}>
                  <Avatar src={selectedTeacher.avatar} sx={{ width: 120, height: 120 }}>
                    {selectedTeacher.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center' }}>
                    {selectedTeacher.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center' }}>
                    {selectedTeacher.employeeId}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={8}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Contact Information
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <MailIcon sx={{ color: '#64748b', fontSize: 16 }} />
                        <Typography variant="body2">{selectedTeacher.email}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon sx={{ color: '#64748b', fontSize: 16 }} />
                        <Typography variant="body2">{selectedTeacher.phone}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOnIcon sx={{ color: '#64748b', fontSize: 16 }} />
                        <Typography variant="body2">{selectedTeacher.address}</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Professional Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>Department</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {selectedTeacher.department}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>Experience</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {selectedTeacher.experience} years
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>Qualification</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {selectedTeacher.qualification}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>Hire Date</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {new Date(selectedTeacher.hireDate).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Specializations
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {selectedTeacher.specialization.map((spec, index) => (
                        <Chip
                          key={index}
                          label={spec}
                          size="small"
                          sx={{
                            bgcolor: '#f1f5f9',
                            color: '#475569',
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsTeacherDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(45,53,83,0.12)',
            border: '1px solid #e2e8f0'
          }
        }}
      >
        <MenuItem onClick={handleViewTeacher}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" sx={{ color: '#2563eb' }} />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditTeacher}>
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ color: '#059669' }} />
          </ListItemIcon>
          <ListItemText>Edit Teacher</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteTeacher}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: '#dc2626' }} />
          </ListItemIcon>
          <ListItemText>Delete Teacher</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}

