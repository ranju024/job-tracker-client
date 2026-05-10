import { useState, useEffect } from 'react'
import api from '../services/api'
import { Box, Container, Typography, Paper, Grid, Chip } from '@mui/material'


function Dashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/api/dashboard/')
                setStats(response.data)
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) return <p>Loading...</p>
    if (!stats) return <p>No data found.</p>


    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Dashboard</Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6">Total Applications</Typography>
                        <Typography variant="h3">{stats.total}</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={8}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>By Status</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {Object.entries(stats.by_status).map(([status, count]) => (
                                <Chip key={status} label={`${status}: ${count}`} color="primary" variant="outlined" />
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Upcoming Interviews</Typography>
                        {stats.upcoming_interviews.length === 0
                            ? <Typography color="text.secondary">No upcoming interviews</Typography>
                            : stats.upcoming_interviews.map((app) => (
                                <Box key={app.id} sx={{ mb: 1 }}>
                                    <Typography>{app.company} — {app.interview_date}</Typography>
                                </Box>
                            ))
                        }
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Stale Applications</Typography>
                        {stats.stale_applications.length === 0
                            ? <Typography color="text.secondary">No stale applications</Typography>
                            : stats.stale_applications.map((app) => (
                                <Box key={app.id} sx={{ mb: 1 }}>
                                    <Typography>{app.company} — {app.updated_at}</Typography>
                                </Box>
                            ))
                        }
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Dashboard