import { useState, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Container, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Grid, Chip } from '@mui/material'


function Jobs() {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedStatus, setSelectedStatus] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        fetchApplications()
    }, [selectedStatus])

    const fetchApplications = async () => {
        try {
            setLoading(true)
            const url = selectedStatus ? `/api/jobs/?status=${selectedStatus}` : '/api/jobs/'
            const response = await api.get(url)
            setApplications(response.data.results)
        } catch (error) {
            console.error('Error fetching applications:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/jobs/${id}/`)
            fetchApplications()
        } catch (error) {
            console.error('Error deleting application:', error)
        }
    }

    if (loading) return <p>Loading...</p>

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Job Applications</Typography>
                <Button variant="contained" onClick={() => navigate('/jobs/add')}>Add Job</Button>
            </Box>

            <FormControl sx={{ mb: 3, minWidth: 200 }}>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                    value={selectedStatus}
                    label="Filter by Status"
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="applied">Applied</MenuItem>
                    <MenuItem value="screening">Screening</MenuItem>
                    <MenuItem value="interviewing">Interviewing</MenuItem>
                    <MenuItem value="offered">Offered</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                    <MenuItem value="ghosted">Ghosted</MenuItem>
                    <MenuItem value="withdrawn">Withdrawn</MenuItem>
                </Select>
            </FormControl>

            <Grid container spacing={2} alignItems="stretch">
                {applications.map((app) => (
                    <Grid item xs={12} sm={6} md={3} key={app.id} sx={{ display: 'flex' }}>
                        <Paper 
                            elevation={2} 
                            sx={{ 
                                p: 3,
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 6,
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            <Box>
                                <Typography variant="h6" fontSize="1.1rem" noWrap>{app.title}</Typography>
                                <Typography color="text.secondary" fontSize="1rem" noWrap>{app.company}</Typography>
                                <Chip 
                                    label={app.status.charAt(0).toUpperCase() + app.status.slice(1)} 
                                    color="primary" 
                                    size="medium" 
                                    sx={{ mt: 1, mb: 1 }} 
                                />
                            </Box>
                            <Box>
                                <Typography variant="body1" sx={{ mb: 1 }}>Applied: {app.date_applied}</Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button size="medium" variant="outlined" onClick={() => navigate(`/jobs/edit/${app.id}`)}>Edit</Button>
                                    <Button size="medium" variant="outlined" color="error" onClick={() => handleDelete(app.id)}>Delete</Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
)
}

export default Jobs