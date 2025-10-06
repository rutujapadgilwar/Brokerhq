import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Grid,
  Tooltip,
  Badge,
  useTheme,
  InputAdornment,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  MailOutline as MailOutlineIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  Visibility as ViewDetailsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle,
  AutoGraph as AutoGraphIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled, keyframes } from '@mui/system';
import { addDays } from 'date-fns';
import Navbar from './Navbar';

// Mock data for demonstration
const mockTasks = [
  {
    id: 1,
    title: 'Call property owner',
    dueDate: 'Apr 25, 2024',
    dueTime: '10:00 AM',
    assignee: 'John O\'Brien',
    priority: 'High',
    notes: 'They are considering options. Call to confirm interest.',
    status: 'open',
  },
  {
    id: 2,
    title: 'Contact tenant',
    dueDate: 'Apr 24, 2024',
    dueTime: '03:00 PM',
    assignee: 'John O\'Brien',
    priority: 'Medium',
    notes: 'Focus on recent comps in Midtown',
    status: 'open',
  },
  {
    id: 3,
    title: 'Send introductory email',
    dueDate: 'Apr 31, 2024',
    dueTime: '05:00 PM',
    assignee: 'John O\'Brien',
    priority: 'High',
    notes: 'Property at 123 Main St.',
    status: 'completed',
  },
  {
    id: 4,
    title: 'Review permit application',
    dueDate: 'May 4, 2024',
    dueTime: '09:00 AM',
    assignee: 'John O\'Brien',
    priority: 'High',
    notes: 'Looking for retail space 5,000-10,000 sq ft',
    status: 'open',
  },
  {
    id: 5,
    title: 'Schedule tour',
    dueDate: 'May 4, 2024',
    dueTime: '02:00 PM',
    assignee: 'John O\'Brien',
    priority: 'High',
    notes: 'Client available Tuesday and Thursday afternoons.',
    status: 'open',
  },
];

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
`;

// New styled component for the main cards
const StyledCard = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
  marginBottom: theme.spacing(3),
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
  padding: theme.spacing(3),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[15],
    transform: 'translateY(-5px)',
  },
}));

const PriorityChip = styled(Chip)(({ theme, priority }) => ({
  fontWeight: 'bold',
  color: theme.palette.common.white,
  ...(priority === 'High' && {
    background: `linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)`,
  }),
  ...(priority === 'Medium' && {
    background: `linear-gradient(45deg, #FFC107 30%, #FFD54F 90%)`,
  }),
  ...(priority === 'Low' && {
    background: `linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)`,
  }),
}));

const TasksPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: null,
    dueTime: '',
    priority: 'Medium',
    notes: '',
    followUpSequence: [],
  });
  const theme = useTheme();

  useEffect(() => {
    // Simulate fetching tasks or updating based on filter changes
    // For now, it just re-filters mock data
    const filtered = mockTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesTab = true;
      if (activeTab === 'open') {
        matchesTab = task.status === 'open';
      } else if (activeTab === 'due_today') { // Changed from 'due_to_tbay'
        // Example: filter by due today
        const today = new Date();
        const taskDueDate = new Date(task.dueDate);
        matchesTab = taskDueDate.toDateString() === today.toDateString();
      } else if (activeTab === 'overdue') {
        matchesTab = new Date(task.dueDate) < new Date();
      }
      return matchesSearch && matchesTab;
    });
    // For a real application, you would fetch data here
    // setFilteredTasks(filtered);
  }, [activeTab, searchTerm]);

  const handleTabChange = (event, newTab) => {
    if (newTab !== null) {
      setActiveTab(newTab);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTaskMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleTaskMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleOpenTaskModal = () => {
    setOpenTaskModal(true);
    setNewTask({
      title: '',
      dueDate: new Date(), // Set default to today
      dueTime: '09:00 AM', // Set default time
      priority: 'Medium',
      notes: '',
      followUpSequence: [],
      status: 'open', // Add default status
      assignee: 'John O\'Brien', // Add default assignee
    });
  };

  const handleCloseTaskModal = () => {
    setOpenTaskModal(false);
    // Reset the form
    setNewTask({
      title: '',
      dueDate: null,
      dueTime: '',
      priority: 'Medium',
      notes: '',
      followUpSequence: [],
      status: 'open',
      assignee: 'John O\'Brien',
    });
  };

  const handleNewTaskChange = (field, value) => {
    setNewTask(prev => ({ 
      ...prev, 
      [field]: value,
      // If this is a follow-up sequence task, update the status
      ...(field === 'followUpSequence' && value.length > 0 && { status: 'open' })
    }));
  };

  const handleAddNextTask = () => {
    const nextDate = newTask.dueDate ? new Date(newTask.dueDate) : new Date();
    nextDate.setMonth(nextDate.getMonth() + (newTask.followUpSequence.length + 1));

    setNewTask(prev => ({
      ...prev,
      followUpSequence: [...prev.followUpSequence, {
        date: nextDate,
        description: `Follow-up ${prev.followUpSequence.length + 1}`
      }],
    }));
  };

  const handleSaveTask = () => {
    // Create a new task object with all required fields
    const taskToSave = {
      id: mockTasks.length + 1, // Generate a new ID
      ...newTask,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : '',
    };

    // In a real application, you would make an API call here
    console.log('Saving task:', taskToSave);
    
    // For demo purposes, we'll just close the modal
    // In a real app, you would update the tasks list here
    handleCloseTaskModal();

    // Show a success message (you can implement a proper notification system)
    alert('Task saved successfully!');
  };

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'open' && task.status === 'open') ||
                       (activeTab === 'due_today' && new Date(task.dueDate).toDateString() === new Date().toDateString()) || // Filter for "Due Today"
                       (activeTab === 'overdue' && new Date(task.dueDate) < new Date());

    return matchesSearch && matchesTab;
  });

  // Add a helper function for date formatting
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Add a helper function for time formatting
  const formatTime = (timeString) => {
    // If the time is already in the correct format, return it
    if (timeString.match(/^\d{1,2}:\d{2} [AP]M$/)) {
      return timeString;
    }
    // Otherwise, try to parse and format it
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return timeString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-40" style={{ marginTop: '64px' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200">
                <AssignmentIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Your Tasks
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Box className="max-w-7xl mx-auto p-6">
        <StyledCard>
          <Stack direction="row" spacing={2} mb={3} alignItems="center" justifyContent="space-between">
            <div className="flex">
              {['ALL TASKS', 'OPEN', 'DUE TODAY', 'OVERDUE'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(null, tab.toLowerCase().replace(/\s+/g, '_'))}
                  className={`px-6 py-4 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.toLowerCase().replace(/\s+/g, '_')
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/30'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button 
              onClick={handleOpenTaskModal}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <AddIcon className="w-4 h-4" />
              <span className="font-medium">Add Task</span>
            </button>
          </Stack>

          {/* Follow-Up Sequence Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Follow-Up Sequence Card - Start New */}
            <Grid item xs={12} md={6}>
              <StyledCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <AutoGraphIcon sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Start New Sequence</Typography>
                </Stack>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Start Date
                    <Typography component="span" fontWeight="bold" sx={{ ml: 1, color: theme.palette.text.primary }}>
                      May 17, 2024
                    </Typography>
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                      <AddIcon className="w-4 h-4" />
                      <span className="font-medium">Start Sequence</span>
                    </button>
                  </Box>
                </Box>
              </StyledCard>
            </Grid>

            {/* Follow-Up Sequence Card - Existing */}
            <Grid item xs={12} md={6}>
              <StyledCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TimelineIcon sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Active Sequence</Typography>
                </Stack>
                <Box sx={{ flexGrow: 1 }}>
                  <List dense sx={{ 
                    '& .MuiListItem-root': { 
                      px: 2, 
                      py: 1,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover
                      }
                    }
                  }}>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <MailOutlineIcon sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email on May 17, 2024"
                        primaryTypographyProps={{ 
                          color: theme.palette.text.primary,
                          fontWeight: 500
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <AssignmentIcon sx={{ color: theme.palette.secondary.main }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Call on May 31, 2024"
                        primaryTypographyProps={{ 
                          color: theme.palette.text.primary,
                          fontWeight: 500
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <MailOutlineIcon sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email on Jun 14, 2024"
                        primaryTypographyProps={{ 
                          color: theme.palette.text.primary,
                          fontWeight: 500
                        }}
                      />
                    </ListItem>
                  </List>
                </Box>
              </StyledCard>
            </Grid>
          </Grid>

          {/* Search Bar */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                padding: '12px 16px',
                backgroundColor: theme.palette.background.default,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: theme.palette.grey[100],
                },
                '&.Mui-focused': {
                  boxShadow: `0 0 0 4px ${theme.palette.primary.light}`,
                  backgroundColor: theme.palette.common.white,
                },
              }
            }}
            sx={{ mb: 3 }}
          />

          {/* Tasks Table Card */}
          <StyledCard sx={{ p: 0 }}>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ backgroundColor: theme.palette.grey[50] }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: '200px' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '140px', textAlign: 'center' }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '120px', textAlign: 'center' }}>Due Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '150px' }}>Assignee</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '120px', textAlign: 'center' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '120px', textAlign: 'center' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '80px', textAlign: 'center' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow 
                      key={task.id} 
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                        '& td': {
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          py: 2
                        }
                      }}
                    >
                      <TableCell sx={{ fontWeight: 'bold' }}>{task.title}</TableCell>
                      <TableCell 
                        align="center"
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          color: theme.palette.text.secondary
                        }}
                      >
                        {formatDate(task.dueDate)}
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          color: theme.palette.text.secondary
                        }}
                      >
                        {formatTime(task.dueTime)}
                      </TableCell>
                      <TableCell>{task.assignee}</TableCell>
                      <TableCell align="center">
                        <PriorityChip 
                          label={task.priority} 
                          priority={task.priority} 
                          size="small"
                          sx={{ minWidth: '80px' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={task.status === 'open' ? 'Open' : 'Completed'}
                          color={task.status === 'open' ? 'info' : 'success'}
                          size="small"
                          sx={{
                            fontWeight: 'bold',
                            minWidth: '90px'
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="more"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={(event) => handleTaskMenuOpen(event, task)}
                          size="small"
                          sx={{
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                            }
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredTasks.length === 0 && (
                    <TableRow>
                      <TableCell 
                        colSpan={7} 
                        sx={{ 
                          color: theme.palette.text.secondary, 
                          textAlign: 'center', 
                          py: 4,
                          fontStyle: 'italic'
                        }}
                      >
                        No tasks found for the selected filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledCard>
        </StyledCard>
      </Box>

      {/* Task Actions Menu */}
      <Menu
        id="task-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleTaskMenuClose}
      >
        <MenuItem onClick={handleTaskMenuClose}>
          <ListItemIcon>
            <ViewDetailsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="View Details" />
        </MenuItem>
        <MenuItem onClick={handleTaskMenuClose}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>

      {/* Add/Edit Task Modal */}
      <Dialog 
        open={openTaskModal} 
        onClose={handleCloseTaskModal} 
        maxWidth="sm"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: 3, 
            p: 2, 
            background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`, 
            boxShadow: theme.shadows[10] 
          } 
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 'bold', 
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2
        }}>
          Add New Task
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Task Title"
              fullWidth
              value={newTask.title}
              onChange={(e) => handleNewTaskChange('title', e.target.value)}
              variant="outlined"
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Due Date"
                    value={newTask.dueDate}
                    onChange={(date) => handleNewTaskChange('dueDate', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Due Time"
                  fullWidth
                  value={newTask.dueTime}
                  onChange={(e) => handleNewTaskChange('dueTime', e.target.value)}
                  variant="outlined"
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>

            <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTask.priority}
                label="Priority"
                onChange={(e) => handleNewTaskChange('priority', e.target.value)}
              >
                <MuiMenuItem value="Low">Low</MuiMenuItem>
                <MuiMenuItem value="Medium">Medium</MuiMenuItem>
                <MuiMenuItem value="High">High</MuiMenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={4}
              value={newTask.notes}
              onChange={(e) => handleNewTaskChange('notes', e.target.value)}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.text.primary }}>
                Follow-Up Sequence
              </Typography>
              <List>
                {newTask.followUpSequence.map((seq, index) => (
                  <ListItem 
                    key={index} 
                    sx={{ 
                      mb: 1, 
                      borderRadius: 1,
                      bgcolor: theme.palette.grey[50],
                      '&:hover': {
                        bgcolor: theme.palette.grey[100]
                      }
                    }}
                  >
                    <ListItemText 
                      primary={`Step ${index + 1}: ${seq.description} on ${seq.date.toLocaleDateString()}`}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => {
                        const newSequence = [...newTask.followUpSequence];
                        newSequence.splice(index, 1);
                        handleNewTaskChange('followUpSequence', newSequence);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddNextTask}
                sx={{ 
                  mt: 2, 
                  borderRadius: 2, 
                  textTransform: 'none',
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': { 
                    background: theme.palette.primary.light,
                    color: theme.palette.common.white
                  }
                }}
              >
                Add Next Step
              </Button>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button 
            onClick={handleCloseTaskModal} 
            color="secondary" 
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveTask}
            variant="contained"
            startIcon={<CheckCircle fontSize="small" />}
            disabled={!newTask.title || !newTask.dueDate || !newTask.dueTime}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3,
              background: `linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)`,
              boxShadow: theme.shadows[5],
              '&:hover': {
                background: `linear-gradient(45deg, #8BC34A 30%, #4CAF50 90%)`,
                boxShadow: theme.shadows[8],
              },
              '&.Mui-disabled': {
                background: theme.palette.grey[300],
                color: theme.palette.grey[500]
              }
            }}
          >
            Save Task
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TasksPage; 