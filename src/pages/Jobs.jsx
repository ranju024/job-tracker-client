import { useState, useEffect, useCallback } from 'react'
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
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    InputAdornment,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import SearchIcon from '@mui/icons-material/Search'


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

const workTypes = [
    ['', 'All work types'],
    ['remote', 'Remote'],
    ['hybrid', 'Hybrid'],
    ['onsite', 'On-site'],
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
    const [selectedWorkType, setSelectedWorkType] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState('')
    const [error, setError] = useState('')

    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [totalCount, setTotalCount] = useState(0)

    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const navigate = useNavigate()

    // Debounce the search box so we don't fire a request on every keystroke.
    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput)
            setPage(1)
        }, 400)

        return () => clearTimeout(timeout)
    }, [searchInput])

    useEffect(() => {
        setPage(1)
    }, [selectedStatus, selectedWorkType])

    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true)
            setError('')

            const params = { page }
            if (selectedStatus) params.status = selectedStatus
            if (selectedWorkType) params.work_type = selectedWorkType
            if (search) params.search = search

            const response = await api.get('/api/jobs/', { params })
            const data = response.data

            if (Array.isArray(data)) {
                // Fallback in case pagination is ever disabled server-side.
                setApplications(data)
                setTotalCount(data.length)
                setPageCount(1)
            } else {
                setApplications(data.results || [])
                setTotalCount(data.count || 0)
                setPageCount(Math.max(1, Math.ceil((data.count || 0) / 10)))
            }
        } catch (error) {
            console.error('Error fetching applications:', error)
            setError('Could not load your applications.')
        } finally {
            setLoading(false)
        }
    }, [page, selectedStatus, selectedWorkType, search])

    useEffect(() => {
        fetchApplications()
    }, [fetchApplications])

    const confirmDelete = (app) => {
        setDeleteTarget(app)
    }

    const cancelDelete = () => {
        if (deleting) return
        setDeleteTarget(null)
    }

    const handleDelete = async () => {
        if (!deleteTarget) return

        setDeleting(true)

        try {
            await api.delete(`/api/jobs/${deleteTarget.id}/`)
            setDeleteTarget(null)
            fetchApplications()
        } catch (error) {
            setError('Could not delete the application.')
            setDeleteTarget(null)
        } finally {
            setDeleting(false)
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
                        placeholder="Search company or title"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        size="small"
                        sx={{
                            minWidth: { xs: '100%', sm: 240 },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon
                                        fontSize="small"
                                        sx={{ color: '#9ca3af' }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        select
                        label="Status"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        size="small"
                        sx={{
                            minWidth: { xs: '100%', sm: 180 },
                        }}
                    >
                        {statuses.map(([value, label]) => (
                            <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Work type"
                        value={selectedWorkType}
                        onChange={(e) => setSelectedWorkType(e.target.value)}
                        size="small"
                        sx={{
                            minWidth: { xs: '100%', sm: 180 },
                        }}
                    >
                        {workTypes.map(([value, label]) => (
                            <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: { sm: 'auto' }, whiteSpace: 'nowrap' }}
                    >
                        {totalCount}{' '}
                        {totalCount === 1 ? 'application' : 'applications'}
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
                            onClick={() =>
                                navigate(`/jobs/edit/${app.id}`)
                            }
                            sx={{
                                p: 2.5,
                                border: '1px solid #e5e7eb',
                                borderRadius: 3,
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
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
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
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
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        navigate(
                                            `/jobs/edit/${app.id}?edit=true`
                                        )
                                    }}
                                >
                                    Edit
                                </Button>

                                <Button
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        confirmDelete(app)
                                    }}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}

            {!loading && pageCount > 1 && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 4,
                    }}
                >
                    <Pagination
                        page={page}
                        count={pageCount}
                        onChange={(e, value) => setPage(value)}
                        shape="rounded"
                        color="primary"
                    />
                </Box>
            )}

            <Dialog open={!!deleteTarget} onClose={cancelDelete}>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    Delete this application?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {deleteTarget && (
                            <>
                                This will permanently remove{' '}
                                <strong>{deleteTarget.title}</strong> at{' '}
                                <strong>{deleteTarget.company}</strong>,
                                along with its interviews and status history.
                                This can't be undone.
                            </>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={cancelDelete} disabled={deleting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        disabled={deleting}
                        startIcon={
                            deleting ? (
                                <CircularProgress size={16} color="inherit" />
                            ) : null
                        }
                    >
                        {deleting ? 'Deleting…' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default Jobs