import React, { useState, useEffect } from 'react';
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
  Paper,
  Checkbox,
  FormControlLabel,
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
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

interface Student {
  id: number;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  grade: string;
  section: string;
  enrollmentDate: string;
  dateOfBirth: string;
  address: string;
  parentName: string;
  parentContact: string;
  status: "active" | "inactive" | "graduated" | "transferred";
  gpa: number;
  attendance: number;
  subjects: string[];
  behaviorScore: number;
  achievements: string[];
  lastActivity: string;
}

const studentStats = [
  {
    title: "Total Students",
    value: "1,247",
    change: "+12",
    changeType: "positive" as const,
    icon: PeopleIcon,
    color: "#2563eb",
    bgColor: "#eff6ff",
  },
  {
    title: "New Enrollments",
    value: "34",
    change: "+8",
    changeType: "positive" as const,
    icon: PersonAddIcon,
    color: "#059669",
    bgColor: "#ecfdf5",
  },
  {
    title: "Average Grade",
    value: "87.5%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: EmojiEventsIcon,
    color: "#d97706",
    bgColor: "#fef3c7",
  },
  {
    title: "Attendance Rate",
    value: "94.2%",
    change: "-1.1%",
    changeType: "negative" as const,
    icon: CheckCircleIcon,
    color: "#7c3aed",
    bgColor: "#f3e8ff",
  },
];

const grades = ["All Grades", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const sections = ["All Sections", "Section A", "Section B", "Section C"];
const statuses = ["All Status", "active", "inactive", "graduated", "transferred"];

export default function StudentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [selectedSection, setSelectedSection] = useState("All Sections");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isStudentDetailsOpen, setIsStudentDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [tabValue, setTabValue] = useState(0);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Sample student data for demonstration
  const sampleStudents: Student[] = [
    {
      id: 1,
      studentId: "STU2024001",
      name: "Emma Watson",
      email: "emma.watson@school.edu",
      phone: "+1 (555) 123-4567",
      avatar: "/placeholder.svg",
      grade: "Grade 12",
      section: "A",
      enrollmentDate: "2021-09-01",
      dateOfBirth: "2006-04-15",
      address: "123 Maple Street, Springfield, IL 62701",
      parentName: "John Watson",
      parentContact: "+1 (555) 123-4568",
      status: "active",
      gpa: 3.85,
      attendance: 96,
      subjects: ["Mathematics", "Physics", "Chemistry", "English"],
      behaviorScore: 95,
      achievements: ["Honor Roll", "Science Fair Winner", "Math Olympiad"],
      lastActivity: "2024-03-15",
    },
    {
      id: 2,
      studentId: "STU2024002",
      name: "James Chen",
      email: "james.chen@school.edu",
      phone: "+1 (555) 234-5678",
      avatar: "/placeholder.svg",
      grade: "Grade 11",
      section: "B",
      enrollmentDate: "2022-09-01",
      dateOfBirth: "2007-08-22",
      address: "456 Oak Avenue, Springfield, IL 62702",
      parentName: "Li Chen",
      parentContact: "+1 (555) 234-5679",
      status: "active",
      gpa: 3.72,
      attendance: 94,
      subjects: ["Physics", "Computer Science", "Mathematics", "English"],
      behaviorScore: 88,
      achievements: ["Programming Contest", "Physics Excellence"],
      lastActivity: "2024-03-14",
    },
    {
      id: 3,
      studentId: "STU2024003",
      name: "Sofia Rodriguez",
      email: "sofia.rodriguez@school.edu",
      phone: "+1 (555) 345-6789",
      avatar: "/placeholder.svg",
      grade: "Grade 10",
      section: "A",
      enrollmentDate: "2023-09-01",
      dateOfBirth: "2008-11-03",
      address: "789 Pine Road, Springfield, IL 62703",
      parentName: "Maria Rodriguez",
      parentContact: "+1 (555) 345-6790",
      status: "active",
      gpa: 3.92,
      attendance: 98,
      subjects: ["English", "History", "Biology", "Art"],
      behaviorScore: 97,
      achievements: ["Literature Award", "Perfect Attendance", "Student Council"],
      lastActivity: "2024-03-15",
    },
    {
      id: 4,
      studentId: "STU2024004",
      name: "David Kim",
      email: "david.kim@school.edu",
      phone: "+1 (555) 456-7890",
      avatar: "/placeholder.svg",
      grade: "Grade 12",
      section: "A",
      enrollmentDate: "2021-09-01",
      dateOfBirth: "2006-01-18",
      address: "321 Elm Street, Springfield, IL 62704",
      parentName: "Sarah Kim",
      parentContact: "+1 (555) 456-7891",
      status: "active",
      gpa: 3.68,
      attendance: 91,
      subjects: ["Computer Science", "Mathematics", "Physics", "English"],
      behaviorScore: 85,
      achievements: ["Code Club President", "Robotics Team"],
      lastActivity: "2024-03-13",
    },
    {
      id: 5,
      studentId: "STU2024005",
      name: "Aisha Patel",
      email: "aisha.patel@school.edu",
      phone: "+1 (555) 567-8901",
      avatar: "/placeholder.svg",
      grade: "Grade 9",
      section: "B",
      enrollmentDate: "2024-09-01",
      dateOfBirth: "2009-06-10",
      address: "654 Cedar Lane, Springfield, IL 62705",
      parentName: "Raj Patel",
      parentContact: "+1 (555) 567-8902",
      status: "active",
      gpa: 3.78,
      attendance: 95,
      subjects: ["Mathematics", "Science", "English", "Social Studies"],
      behaviorScore: 92,
      achievements: ["New Student Excellence", "Math Competition"],
      lastActivity: "2024-03-15",
    },
    {
      id: 6,
      studentId: "STU2024006",
      name: "Michael Johnson",
      email: "michael.johnson@school.edu",
      phone: "+1 (555) 678-9012",
      avatar: "/placeholder.svg",
      grade: "Grade 11",
      section: "C",
      enrollmentDate: "2022-09-01",
      dateOfBirth: "2007-03-25",
      address: "987 Birch Drive, Springfield, IL 62706",
      parentName: "Robert Johnson",
      parentContact: "+1 (555) 678-9013",
      status: "active",
      gpa: 3.45,
      attendance: 89,
      subjects: ["History", "Geography", "English", "Physical Education"],
      behaviorScore: 82,
      achievements: ["Sports Captain", "Debate Team"],
      lastActivity: "2024-03-12",
    },
    {
      id: 7,
      studentId: "STU2024007",
      name: "Sarah Williams",
      email: "sarah.williams@school.edu",
      phone: "+1 (555) 789-0123",
      avatar: "/placeholder.svg",
      grade: "Grade 10",
      section: "B",
      enrollmentDate: "2023-09-01",
      dateOfBirth: "2008-07-14",
      address: "147 Willow Way, Springfield, IL 62707",
      parentName: "Jennifer Williams",
      parentContact: "+1 (555) 789-0124",
      status: "active",
      gpa: 3.91,
      attendance: 97,
      subjects: ["Biology", "Chemistry", "Mathematics", "English"],
      behaviorScore: 94,
      achievements: ["Science Club", "Academic Excellence"],
      lastActivity: "2024-03-14",
    },
    {
      id: 8,
      studentId: "STU2024008",
      name: "Alex Thompson",
      email: "alex.thompson@school.edu",
      phone: "+1 (555) 890-1234",
      avatar: "/placeholder.svg",
      grade: "Grade 12",
      section: "B",
      enrollmentDate: "2021-09-01",
      dateOfBirth: "2006-12-08",
      address: "258 Spruce Street, Springfield, IL 62708",
      parentName: "Thomas Thompson",
      parentContact: "+1 (555) 890-1235",
      status: "graduated",
      gpa: 3.95,
      attendance: 99,
      subjects: ["Advanced Mathematics", "Physics", "Computer Science", "Literature"],
      behaviorScore: 98,
      achievements: ["Valedictorian", "National Merit Scholar", "Robotics Champion"],
      lastActivity: "2024-05-20",
    },
    {
      id: 9,
      studentId: "STU2024009",
      name: "Maria Garcia",
      email: "maria.garcia@school.edu",
      phone: "+1 (555) 901-2345",
      avatar: "/placeholder.svg",
      grade: "Grade 9",
      section: "A",
      enrollmentDate: "2024-09-01",
      dateOfBirth: "2009-02-19",
      address: "369 Maple Avenue, Springfield, IL 62709",
      parentName: "Carlos Garcia",
      parentContact: "+1 (555) 901-2346",
      status: "active",
      gpa: 3.65,
      attendance: 93,
      subjects: ["Spanish", "English", "Mathematics", "Art"],
      behaviorScore: 89,
      achievements: ["Language Excellence", "Art Competition"],
      lastActivity: "2024-03-15",
    },
    {
      id: 10,
      studentId: "STU2024010",
      name: "Ryan Davis",
      email: "ryan.davis@school.edu",
      phone: "+1 (555) 012-3456",
      avatar: "/placeholder.svg",
      grade: "Grade 11",
      section: "A",
      enrollmentDate: "2022-09-01",
      dateOfBirth: "2007-09-30",
      address: "741 Oak Street, Springfield, IL 62710",
      parentName: "Lisa Davis",
      parentContact: "+1 (555) 012-3457",
      status: "inactive",
      gpa: 2.85,
      attendance: 78,
      subjects: ["Physical Education", "Health", "English", "Mathematics"],
      behaviorScore: 75,
      achievements: ["Sports Team", "Fitness Award"],
      lastActivity: "2024-02-28",
    }
  ];

  useEffect(() => {
    // Use sample data for now, but keep the fetchStudents function for when backend is ready
    setStudents(sampleStudents);
    setLoading(false);
    
    // Uncomment this when backend is ready:
    // fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      
      if (response.data.success) {
        // Transform backend data to match frontend interface
        const transformedStudents = response.data.items.map((student: any) => ({
          id: student.id,
          studentId: student.student_id || `STU${student.id}`,
          name: student.full_name || 'Unknown',
          email: student.user?.email || '',
          phone: student.user?.phone || '',
          avatar: '',
          grade: student.current_class_name || 'Not Assigned',
          section: 'A', // Default section
          enrollmentDate: student.admission_date || '',
          dateOfBirth: student.user?.date_of_birth || '',
          address: student.user?.address || '',
          parentName: student.parent_name || '',
          parentContact: student.parent_phone || '',
          status: student.status || 'active',
          gpa: student.average_grade || 0,
          attendance: student.attendance_percentage || 0,
          subjects: [], // Will need to fetch from subjects table
          behaviorScore: 85, // Default value
          achievements: [], // Will need to fetch from achievements table
          lastActivity: student.updated_at || '',
        }));
        setStudents(transformedStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade =
      selectedGrade === "All Grades" || student.grade === selectedGrade;
    const matchesSection =
      selectedSection === "All Sections" ||
      `Section ${student.section}` === selectedSection;
    const matchesStatus =
      selectedStatus === "All Status" || student.status === selectedStatus;

    return matchesSearch && matchesGrade && matchesSection && matchesStatus;
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
      case "inactive":
        return (
          <Chip
            label="Inactive"
            size="small"
            variant="outlined"
            sx={{
              borderColor: '#fbbf24',
              color: '#d97706',
              fontWeight: 600
            }}
          />
        );
      case "graduated":
        return (
          <Chip
            label="Graduated"
            size="small"
            sx={{
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#eff6ff' }
            }}
          />
        );
      case "transferred":
        return (
          <Chip
            label="Transferred"
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

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return "#059669";
    if (gpa >= 3.0) return "#2563eb";
    if (gpa >= 2.5) return "#d97706";
    return "#dc2626";
  };

  const handleStudentSelect = (studentId: number, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const openStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsStudentDetailsOpen(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>Loading students...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, space: 8 }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
              Student Management
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Manage student records, enrollment, and academic progress
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button variant="outlined" size="small" startIcon={<DownloadIcon />}>
              Export
            </Button>
            <Button variant="outlined" size="small" startIcon={<UploadIcon />}>
              Import
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => navigate('/students/add')}
              sx={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)' }
              }}
            >
              Add Student
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {studentStats.map((stat) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s ease',
                '&:hover': { boxShadow: 4 }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      backgroundColor: stat.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <stat.icon sx={{ color: stat.color, fontSize: 20 }} />
                  </Box>
                  <Chip
                    label={stat.change}
                    size="small"
                    sx={{
                      backgroundColor: stat.changeType === 'positive' ? '#ecfdf5' : '#fef2f2',
                      color: stat.changeType === 'positive' ? '#059669' : '#dc2626',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {stat.title}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Box sx={{ mb: 6 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 4 }}>
          <Tab label="All Students" />
          <Tab label="Enrollment" />
          <Tab label="Academic" />
          <Tab label="Reports" />
        </Tabs>

        {tabValue === 0 && (
          <Box sx={{ space: 4 }}>
            {/* Filters */}
            <Card sx={{ mb: 4 }}>
              <CardContent sx={{ pt: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <Box sx={{ position: 'relative', flex: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Search students by name, ID, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Grade</InputLabel>
                      <Select
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        label="Grade"
                      >
                        {grades.map((grade) => (
                          <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Section</InputLabel>
                      <Select
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        label="Section"
                      >
                        {sections.map((section) => (
                          <MenuItem key={section} value={section}>{section}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        label="Status"
                      >
                        {statuses.map((status) => (
                          <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button variant="outlined" size="small" startIcon={<FilterIcon />}>
                      Filter
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedStudents.length > 0 && (
              <Card sx={{ mb: 4, backgroundColor: 'primary.50', borderColor: 'primary.200' }}>
                <CardContent sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="outlined" size="small" startIcon={<EmailIcon />}>
                        Send Email
                      </Button>
                      <Button variant="outlined" size="small" startIcon={<FileCopyIcon />}>
                        Generate Report
                      </Button>
                      <Button variant="outlined" size="small" startIcon={<DownloadIcon />}>
                        Export Selected
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Students Table */}
            <Card>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Students Directory
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Comprehensive list of all enrolled students
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant={viewMode === "table" ? "contained" : "outlined"}
                        size="small"
                        onClick={() => setViewMode("table")}
                      >
                        Table
                      </Button>
                      <Button
                        variant={viewMode === "grid" ? "contained" : "outlined"}
                        size="small"
                        onClick={() => setViewMode("grid")}
                      >
                        Grid
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {viewMode === "table" ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: 'grey.50' }}>
                          <TableCell sx={{ width: 50 }}>
                            <Checkbox
                              checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                              indeterminate={selectedStudents.length > 0 && selectedStudents.length < filteredStudents.length}
                              onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                          </TableCell>
                          <TableCell>Student</TableCell>
                          <TableCell>Grade & Section</TableCell>
                          <TableCell>Contact</TableCell>
                          <TableCell>GPA</TableCell>
                          <TableCell>Attendance</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell sx={{ width: 50 }}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                            <TableCell>
                              <Checkbox
                                checked={selectedStudents.includes(student.id)}
                                onChange={(e) => handleStudentSelect(student.id, e.target.checked)}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ width: 40, height: 40, backgroundColor: 'primary.100', color: 'primary.600' }}>
                                  {student.name.split(' ').map((n) => n[0]).join('')}
                                </Avatar>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                                    onClick={() => openStudentDetails(student)}
                                  >
                                    {student.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {student.studentId}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {student.grade}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Section {student.section}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ space: 0.5 }}>
                                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <MailIcon sx={{ fontSize: 12 }} />
                                  {student.email}
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <PhoneIcon sx={{ fontSize: 12 }} />
                                  {student.phone}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 700, color: getGPAColor(student.gpa) }}
                                >
                                  {student.gpa.toFixed(2)}
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={(student.gpa / 4.0) * 100}
                                  sx={{ width: 48, height: 6, borderRadius: 3 }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {student.attendance}%
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={student.attendance}
                                  sx={{ width: 48, height: 6, borderRadius: 3 }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell>{getStatusBadge(student.status)}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <Tooltip title="View Student">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => navigate(`/students/${student.id}`)}
                                    sx={{ color: 'primary.main' }}
                                  >
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Student">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => navigate(`/students/${student.id}/edit`)}
                                    sx={{ color: 'info.main' }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <IconButton size="small">
                                  <MoreVertIcon />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      {filteredStudents.map((student) => (
                        <Grid item xs={12} md={6} lg={4} key={student.id}>
                          <Card
                            sx={{
                              height: '100%',
                              transition: 'all 0.2s ease',
                              '&:hover': { 
                                boxShadow: 8,
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Avatar sx={{ width: 48, height: 48, backgroundColor: 'primary.100', color: 'primary.600' }}>
                                    {student.name.split(' ').map((n) => n[0]).join('')}
                                  </Avatar>
                                  <Box>
                                    <Typography
                                      variant="h6"
                                      sx={{ fontWeight: 700, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                                      onClick={() => openStudentDetails(student)}
                                    >
                                      {student.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      {student.studentId}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Checkbox
                                  checked={selectedStudents.includes(student.id)}
                                  onChange={(e) => handleStudentSelect(student.id, e.target.checked)}
                                />
                              </Box>

                              <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                  <Grid item xs={6}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      Grade & Section
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {student.grade} - {student.section}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      Status
                                    </Typography>
                                    {getStatusBadge(student.status)}
                                  </Grid>
                                </Grid>

                                <Box sx={{ mb: 2 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      GPA
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{ fontWeight: 700, color: getGPAColor(student.gpa) }}
                                    >
                                      {student.gpa.toFixed(2)}/4.0
                                    </Typography>
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={(student.gpa / 4.0) * 100}
                                    sx={{ height: 6, borderRadius: 3 }}
                                  />
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      Attendance
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {student.attendance}%
                                    </Typography>
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={student.attendance}
                                    sx={{ height: 6, borderRadius: 3 }}
                                  />
                                </Box>
                              </Box>

                                                             <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                   <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                     {student.subjects.length} subjects
                                   </Typography>
                                   <Box sx={{ display: 'flex', gap: 1 }}>
                                     <Tooltip title="View Student">
                                       <IconButton 
                                         size="small" 
                                         onClick={() => navigate(`/students/${student.id}`)}
                                         sx={{ color: 'primary.main' }}
                                       >
                                         <VisibilityIcon fontSize="small" />
                                       </IconButton>
                                     </Tooltip>
                                     <Tooltip title="Edit Student">
                                       <IconButton 
                                         size="small" 
                                         onClick={() => navigate(`/students/${student.id}/edit`)}
                                         sx={{ color: 'info.main' }}
                                       >
                                         <EditIcon fontSize="small" />
                                       </IconButton>
                                     </Tooltip>
                                   </Box>
                                 </Box>
                               </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        )}

        {tabValue === 1 && (
          <Card>
            <CardContent sx={{ py: 12, textAlign: 'center' }}>
              <PersonAddIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Enrollment Center
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                Process new applications, manage waitlists, and handle transfers
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/students/add')}
                >
                  New Enrollment
                </Button>
                <Button variant="outlined" startIcon={<FileCopyIcon />}>
                  Pending Applications
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {tabValue === 2 && (
          <Card>
            <CardContent sx={{ py: 12, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Academic Analytics
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                Track grades, attendance, behavior scores, and achievements
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button variant="contained" startIcon={<BarChartIcon />}>
                  View Analytics
                </Button>
                <Button variant="outlined" startIcon={<TrophyIcon />}>
                  Awards & Recognition
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {tabValue === 3 && (
          <Card>
            <CardContent sx={{ py: 12, textAlign: 'center' }}>
              <FileCopyIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Student Reports
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                Create detailed reports on academic performance, attendance, and behavior
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button variant="contained" startIcon={<FileCopyIcon />}>
                  Generate Report
                </Button>
                <Button variant="outlined" startIcon={<DownloadIcon />}>
                  Export Data
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Student Details Modal */}
      <Dialog
        open={isStudentDetailsOpen}
        onClose={() => setIsStudentDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedStudent && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 40, height: 40, backgroundColor: 'primary.100', color: 'primary.600' }}>
                {selectedStudent.name.split(' ').map((n) => n[0]).join('')}
              </Avatar>
              {selectedStudent.name}
              {getStatusBadge(selectedStudent.status)}
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Student ID: {selectedStudent.studentId} • {selectedStudent.grade} - Section {selectedStudent.section}
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Contact Information
                    </Typography>
                    <Box sx={{ space: 1 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <MailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        {selectedStudent.email}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        {selectedStudent.phone}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        {selectedStudent.address}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Parent/Guardian
                    </Typography>
                    <Box sx={{ space: 1 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        {selectedStudent.parentName}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        {selectedStudent.parentContact}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Academic Performance
                    </Typography>
                    <Box sx={{ space: 2 }}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">GPA</Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, color: getGPAColor(selectedStudent.gpa) }}
                          >
                            {selectedStudent.gpa.toFixed(2)}/4.0
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(selectedStudent.gpa / 4.0) * 100}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">Attendance</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {selectedStudent.attendance}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={selectedStudent.attendance}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">Behavior Score</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {selectedStudent.behaviorScore}/100
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={selectedStudent.behaviorScore}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Enrolled Subjects
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedStudent.subjects.map((subject, index) => (
                        <Chip
                          key={index}
                          label={subject}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Achievements & Awards
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedStudent.achievements.map((achievement, index) => (
                    <Chip
                      key={index}
                      label={achievement}
                      size="small"
                      icon={<StarIcon />}
                      sx={{
                        backgroundColor: '#fef3c7',
                        color: '#d97706',
                        '&:hover': { backgroundColor: '#fef3c7' }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setIsStudentDetailsOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
              >
                Edit Student
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}


