import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  Divider,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  School as SchoolIcon,
  Book,
  EventNote,
  Grade,
  AdminPanelSettings,
  Notifications,
  AccountCircle,
  Settings,
  Logout,
  Business,
  SupervisorAccount,
  FamilyRestroom,
  DirectionsBus,
  Campaign,
  Search,
  Language,
  Phone,
  ExpandLess,
  ExpandMore,
  Paid,
  AttachMoney,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 240;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  const handleProfile = () => {
    handleProfileMenuClose();
    navigate('/profile');
  };

  type NavItem = { text: string; icon: React.ReactNode; path?: string; children?: NavItem[] };
  // Define navigation items based on user role (styled like the images)
  const getNavigationItems = (): { mainItems: NavItem[]; bottomItems: NavItem[] } => {
    const studentsGroup: NavItem = {
      text: 'Students',
      icon: <People />,
      children: [
        { text: 'All Students', icon: <People />, path: '/students' },
        { text: 'Student Details', icon: <People />, path: '/students/1' },
      ],
    };

    const mainItems: NavItem[] = [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      studentsGroup,
      { text: 'Teachers', icon: <People />, path: '/teachers' },
      { text: 'Parents', icon: <FamilyRestroom />, path: '/parents' },
      { text: 'Account', icon: <AccountCircle />, path: '/account' },
      { text: 'Fees', icon: <Paid />, path: '/fees' },
      { text: 'Income', icon: <AttachMoney />, path: '/income' },
      { text: 'Class', icon: <SchoolIcon />, path: '/classes' },
      { text: 'Exam', icon: <EventNote />, path: '/exam' },
      { text: 'Transport', icon: <DirectionsBus />, path: '/transport' },
      { text: 'Notice', icon: <Campaign />, path: '/notice' },
      { text: 'Subjects', icon: <Book />, path: '/subjects' },
      { text: 'Attendance', icon: <EventNote />, path: '/attendance' },
      { text: 'Grades', icon: <Grade />, path: '/grades' },
    ];

    if (user?.role === 'super_admin') {
      mainItems.splice(1, 0, { text: 'Schools', icon: <Business />, path: '/schools' });
      mainItems.push({ text: 'System Admin', icon: <AdminPanelSettings />, path: '/admin' });
    } else if (user?.role === 'school_admin' || user?.role === 'principal' || user?.role === 'director') {
      mainItems.push({ text: 'School Admin', icon: <SupervisorAccount />, path: '/admin' });
    }

    const bottomItems = [
      { text: 'Settings', icon: <Settings />, path: '/settings' },
      { text: 'Logout', icon: <Logout />, path: '/logout' },
    ];

    return { mainItems, bottomItems };
  };

  const { mainItems, bottomItems } = getNavigationItems();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => ({
    Students: location.pathname.startsWith('/students'),
  }));
  const toggleGroup = (key: string) => setOpenGroups((s) => ({ ...s, [key]: !s[key] }));

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ width: 28, height: 28 }}>A</Avatar>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
            ACERO
          </Typography>
        </Stack>
      </Toolbar>
      <Divider />
      <List>
        {mainItems.map((item) => (
          <React.Fragment key={item.text}>
            {!item.children ? (
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => item.path && navigate(item.path)}
                  sx={{
                    borderRadius: 1.5,
                    mx: 1,
                    my: 0.25,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(45,53,83,0.08)',
                      color: 'primary.main',
                      '&:hover': { backgroundColor: 'rgba(45,53,83,0.12)' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => toggleGroup(item.text)} sx={{ mx: 1, my: 0.25, borderRadius: 1.5 }}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {openGroups[item.text] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={openGroups[item.text]} unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItem key={child.text} disablePadding>
                        <ListItemButton
                          selected={Boolean(child.path && location.pathname === child.path)}
                          onClick={() => { if (typeof child.path === 'string') navigate(child.path); }}
                          sx={{ ml: 4, mr: 1, my: 0.25, borderRadius: 1.5, '&.Mui-selected': { backgroundColor: 'rgba(45,53,83,0.08)', color: 'primary.main' } }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>{child.icon}</ListItemIcon>
                          <ListItemText primary={child.text} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            )}
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        {bottomItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                if (item.path === '/logout') {
                  handleLogout();
                } else if (typeof item.path === 'string') {
                  navigate(item.path);
                }
              }}
              sx={{ mx: 1, my: 0.25, borderRadius: 1.5 }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          borderBottom: '1px solid #ECEEF3',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search here..."
            sx={{ flexGrow: 1, mr: 2, maxWidth: 500, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            {/* Contact and language */}
            <Chip icon={<Phone />} label="(1234) 567 890" size="small" sx={{ mr: 2, bgcolor: 'rgba(0,0,0,0.04)' }} />
            <Chip icon={<Language />} label="EN" size="small" sx={{ mr: 2, bgcolor: 'rgba(0,0,0,0.04)' }} />

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton color="inherit" sx={{ mr: 1 }}>
                <Badge badgeContent={4} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User Profile Menu */}
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ ml: 1 }}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: user?.role === 'super_admin' ? '#7C3AED' : user?.role === 'school_admin' ? '#2563EB' : user?.role === 'principal' ? '#059669' : user?.role === 'director' ? '#D97706' : user?.role === 'teacher' ? '#DB2777' : '#0EA5E9' }}>
                  {user?.first_name?.[0] || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            anchorEl={profileMenuAnchor}
            open={Boolean(profileMenuAnchor)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#F4F6FA' },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#F4F6FA' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <CssBaseline />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

