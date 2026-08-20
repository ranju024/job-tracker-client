import { useState, useEffect } from 'react'
import api from '../services/api'

import {
    Box,
    Container,
    Typography,
    Paper,
    Chip,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material'

import { useNavigate } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import WorkIcon from '@mui/icons-material/Work'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'


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


function Dashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/api/dashboard/')
                setStats(response.data)
            } catch (error) {
                setError('Could not load dashboard data.')
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    py: 12,
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Container sx={{ py: 5 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        )
    }

    const byStatus = stats.by_status || {}

    const totalCount = stats.total_applications || 0
    const activeCount = stats.active_applications || 0
    const offeredCount = stats.offers || 0
    const rejectedCount = stats.rejected || 0
    const responseRate = stats.response_rate ?? 0

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
                    mb: 4,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: '-0.6px',
                        }}
                    >
                        Dashboard
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                        Here's an overview of your job search.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    onClick={() => navigate('/jobs/add')}
                    sx={{
                        px: 2.5,
                        py: 1.2,
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

            {/* Stats */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(6, 1fr)',
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                <StatCard
                    label="Total applications"
                    value={totalCount}
                    icon={<WorkIcon />}
                    onClick={() => navigate('/jobs')}
                />

                <StatCard
                    label="Active applications"
                    value={activeCount}
                    icon={<WorkIcon />}
                    onClick={() => navigate('/jobs?status=active')}
                />

                <StatCard
                    label="Upcoming interviews"
                    value={stats.upcoming_interviews.length}
                    icon={<EventOutlinedIcon />}
                    onClick={() =>
                        navigate('/jobs?upcoming_interview=true')
                    }
                />

                <StatCard
                    label="Offers"
                    value={offeredCount}
                    icon={<WorkIcon />}
                    onClick={() => navigate('/jobs?status=offered')}
                />

                <StatCard
                    label="Rejected"
                    value={rejectedCount}
                    icon={<WorkIcon />}
                    onClick={() => navigate('/jobs?status=rejected')}
                />

                <StatCard
                    label="Response rate"
                    value={`${responseRate}%`}
                    icon={<TrendingUpIcon />}
                />
            </Box>

            {/* Main content */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: '1fr 1fr',
                    },
                    gap: 2,
                }}
            >
                {/* Status */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: '1px solid #e5e7eb',
                        borderRadius: 3,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 750, mb: 2.5 }}
                    >
                        Application pipeline
                    </Typography>

                    {Object.keys(byStatus).length === 0 ? (
                        <Typography color="text.secondary">
                            No applications yet.
                        </Typography>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {Object.entries(byStatus).map(
                                ([status, count]) => {
                                    const style =
                                        statusStyles[status] ||
                                        statusStyles.applied

                                    const percentage =
                                        totalCount > 0
                                            ? (count / totalCount) * 100
                                            : 0

                                    return (
                                        <Box key={status}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                    mb: 0.7,
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        textTransform:
                                                            'capitalize',
                                                    }}
                                                >
                                                    {status}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    sx={{ fontWeight: 700 }}
                                                >
                                                    {count}
                                                </Typography>
                                            </Box>

                                            <Box
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 5,
                                                    background: '#f1f5f9',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        height: '100%',
                                                        width: `${percentage}%`,
                                                        background: style.color,
                                                        borderRadius: 5,
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    )
                                }
                            )}
                        </Box>
                    )}
                </Paper>

                {/* Interviews */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: '1px solid #e5e7eb',
                        borderRadius: 3,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 750 }}
                        >
                            Upcoming interviews
                        </Typography>

                        <EventOutlinedIcon
                            sx={{ color: '#4f46e5' }}
                        />
                    </Box>

                    {stats.upcoming_interviews.length === 0 ? (
                        <Typography color="text.secondary">
                            No upcoming interviews.
                        </Typography>
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1.5,
                            }}
                        >
                            {stats.upcoming_interviews
                                .slice(0, 5)
                                .map((interview) => (
                                    <Box
                                        key={interview.id}
                                        onClick={() =>
                                            navigate(
                                                `/jobs/edit/${interview.application}`
                                            )
                                        }
                                        sx={{
                                            p: 1.8,
                                            borderRadius: 2,
                                            background: '#f8fafc',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            gap: 2,
                                            cursor: 'pointer',
                                            transition: 'background 0.15s ease',
                                            '&:hover': {
                                                background: '#eef2ff',
                                            },
                                        }}
                                    >
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {interview.application_title}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {interview.application_company}
                                            </Typography>
                                        </Box>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 700,
                                                color: '#4f46e5',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {new Date(
                                                interview.scheduled_at
                                            ).toLocaleString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                            })}
                                        </Typography>
                                    </Box>
                                ))}
                        </Box>
                    )}

                    {stats.upcoming_interviews.length > 5 && (
                        <Button
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate('/jobs')}
                            sx={{ mt: 2, fontWeight: 700 }}
                        >
                            View applications
                        </Button>
                    )}
                </Paper>

                {/* Stale */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: '1px solid #e5e7eb',
                        borderRadius: 3,
                        gridColumn: { md: '1 / -1' },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1,
                            mb: 2,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WarningAmberOutlinedIcon
                                sx={{ color: '#f59e0b' }}
                            />

                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 750 }}
                            >
                                Applications needing attention
                            </Typography>
                        </Box>

                        {stats.stale_applications.length >= 10 && (
                            <Button
                                size="small"
                                onClick={() => navigate('/jobs?stale=true')}
                                sx={{ fontWeight: 700 }}
                            >
                                View all
                            </Button>
                        )}
                    </Box>

                    {stats.stale_applications.length === 0 ? (
                        <Typography color="text.secondary">
                            Great! No applications have gone stale.
                        </Typography>
                    ) : (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                },
                                gap: 1.5,
                            }}
                        >
                            {stats.stale_applications
                                .slice(0, 6)
                                .map((app) => (
                                    <Box
                                        key={app.id}
                                        onClick={() =>
                                            navigate(`/jobs/edit/${app.id}`)
                                        }
                                        sx={{
                                            p: 2,
                                            border: '1px solid #f1f5f9',
                                            borderRadius: 2,
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease',
                                            '&:hover': {
                                                borderColor: '#fcd34d',
                                                background: '#fffbeb',
                                            },
                                        }}
                                    >
                                        <Typography
                                            sx={{ fontWeight: 700 }}
                                        >
                                            {app.title}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {app.company}
                                        </Typography>

                                        <Chip
                                            label="Needs follow-up"
                                            size="small"
                                            sx={{
                                                mt: 1,
                                                color: '#b45309',
                                                background: '#fffbeb',
                                                fontWeight: 600,
                                            }}
                                        />
                                    </Box>
                                ))}
                        </Box>
                    )}
                </Paper>
            </Box>
        </Container>
    )
}


function StatCard({ label, value, icon, onClick }) {
    return (
        <Paper
            elevation={0}
            onClick={onClick}
            sx={{
                p: 2.5,
                border: '1px solid #e5e7eb',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                ...(onClick && {
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
                        borderColor: '#c7d2fe',
                    },
                }),
            }}
        >
            <Box
                sx={{
                    width: 46,
                    height: 46,
                    borderRadius: 2,
                    background: '#eef2ff',
                    color: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>

            <Box>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.3 }}
                >
                    {label}
                </Typography>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 800,
                        lineHeight: 1,
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Paper>
    )
}

export default Dashboard