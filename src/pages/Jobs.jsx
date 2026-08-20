import { useState, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    Chip,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'


const statuses = [
    ['', 'All statuses'],
    ['applied', 'Applied'],
    ['screening', 'Screening'],
    ['interviewing', 'Interviewing'],
    ['offered', 'Offered'],
    ['rejected', 'Rejected'],
    ['ghosted', 'Ghosted'],
    ['withdrawn', 'Withdrawn'],
]


function getNextInterview(app) {
    const interviews = app.interviews || []

    const upcoming = interviews
        .filter(
            (interview) =>
                new Date(interview.scheduled_at) >= new Date()
        )
        .sort(
            (a, b) =>
                new Date(a.scheduled_at) - new Date(b.scheduled_at)
        )

    return upcoming[0] || null
}


const statusStyles = {
    applied: {
        color: '#2563eb',
        background: '#eff6ff',
    },
    screening: {
        color: '#7c3aed',
        background: '#f5f3ff',
    },
    interviewing: {
        color: '#0891b2',
        background: '#ecfeff',
    },
    offered: {
        color: '#15803d',
        background: '#f0fdf4',
    },
    rejected: {
        color: '#dc2626',
        background: '#fef2f2',
    },
    ghosted: {
        color: '#6b7280',
        background: '#f3f4f6',
    },
    withdrawn: {
        color: '#c2410c',
        background: '#fff7ed',
    },
}


function StatusChip({ status }) {
    const style = statusStyles[status] || statusStyles.applied

    return (
        <Chip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            size="small"
            sx={{
                fontWeight: 700,
                color: style.color,
                backgroundColor: style.background,
                border: 'none',
            }}
        />
    )
}


function Jobs() {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedStatus, setSelectedStatus] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        fetchApplications()
    }, [selectedStatus])

    const fetchApplications = async () => {
        try {
            setLoading(true)
            setError('')

            const url = selectedStatus
                ? `/api/jobs/?status=${selectedStatus}`
                : '/api/jobs/'

            const response = await api.get(url)

            setApplications(response.data.results || response.data || [])
        } catch (error) {
            console.error('Error fetching applications:', error)
            setError('Could not load your applications.')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this application?'
        )

        if (!confirmed) return

        try {
            await api.delete(`/api/jobs/${id}/`)
            fetchApplications()
        } catch (error) {
            setError('Could not delete the application.')
        }
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 5 } }}>
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: '-0.5px',
                        }}
                    >
                        Applications
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                        Keep track of every opportunity in one place.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/jobs/add')}
                    sx={{
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 2,
                        background: '#4f46e5',
                        fontWeight: 700,
                        '&:hover': {
                            background: '#4338ca',
                        },
                    }}
                >
                    Add application
                </Button>
            </Box>

            {/* Filters */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    border: '1px solid #e5e7eb',
                    borderRadius: 3,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <TextField
                        select
                        label="Filter by status"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        size="small"
                        sx={{
                            minWidth: { xs: '100%', sm: 220 },
                        }}
                    >
                        {statuses.map(([value, label]) => (
                            <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: { sm: 'auto' } }}
                    >
                        {applications.length}{' '}
                        {applications.length === 1
                            ? 'application'
                            : 'applications'}
                    </Typography>
                </Box>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Loading */}
            {loading && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        py: 10,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            {/* Empty */}
            {!loading && applications.length === 0 && (
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, sm: 7 },
                        textAlign: 'center',
                        border: '1px solid #e5e7eb',
                        borderRadius: 3,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 1 }}
                    >
                        No applications found
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        Start tracking your job search by adding your first
                        application.
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/jobs/add')}
                        sx={{
                            background: '#4f46e5',
                            fontWeight: 700,
                        }}
                    >
                        Add application
                    </Button>
                </Paper>
            )}

            {/* Cards */}
            {!loading && applications.length > 0 && (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                        },
                        gap: 2,
                    }}
                >
                    {applications.map((app) => (
                        <Paper
                            key={app.id}
                            elevation={0}
                            sx={{
                                p: 2.5,
                                border: '1px solid #e5e7eb',
                                borderRadius: 3,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                    boxShadow:
                                        '0 12px 30px rgba(15, 23, 42, 0.08)',
                                    borderColor: '#c7d2fe',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: 1,
                                }}
                            >
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 750,
                                            fontSize: '1.05rem',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {app.title}
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            mt: 0.3,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {app.company}
                                    </Typography>
                                </Box>

                                {app.url && (
                                    <Tooltip title="Open job posting">
                                        <IconButton
                                            size="small"
                                            component="a"
                                            href={app.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <OpenInNewIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <StatusChip status={app.status} />
                            </Box>

                            <Box
                                sx={{
                                    mt: 2,
                                    pt: 2,
                                    borderTop: '1px solid #f0f0f0',
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Applied
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        mt: 0.3,
                                    }}
                                >
                                    {app.date_applied}
                                </Typography>
                            </Box>

                            {getNextInterview(app) && (
                                <Box sx={{ mt: 1.5 }}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Next interview
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 600,
                                            mt: 0.3,
                                        }}
                                    >
                                        {new Date(
                                            getNextInterview(app).scheduled_at
                                        ).toLocaleString(undefined, {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })}
                                    </Typography>
                                </Box>
                            )}

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    mt: 2.5,
                                }}
                            >
                                <Button
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={() =>
                                        navigate(`/jobs/edit/${app.id}`)
                                    }
                                >
                                    Edit
                                </Button>

                                <Button
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDelete(app.id)}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}
        </Container>
    )
}

export default Jobs