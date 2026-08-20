import { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    MenuItem,
    Alert,
    CircularProgress,
} from '@mui/material'


const statuses = [
    ['applied', 'Applied'],
    ['screening', 'Screening'],
    ['interviewing', 'Interviewing'],
    ['offered', 'Offered'],
    ['rejected', 'Rejected'],
    ['ghosted', 'Ghosted'],
    ['withdrawn', 'Withdrawn'],
]


function AddJob() {
    const today = new Date().toISOString().split('T')[0]

    const [company, setCompany] = useState('')
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [status, setStatus] = useState('applied')
    const [notes, setNotes] = useState('')
    const [date_applied, setDateApplied] = useState(today)
    const [interview_date, setInterviewDate] = useState('')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')
        setLoading(true)

        try {
            await api.post('/api/jobs/', {
                company,
                title,
                url: url || null,
                status,
                notes: notes || null,
                date_applied,
                interview_date: interview_date || null,
            })

            navigate('/jobs')
        } catch (error) {
            setError('Could not add the application. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h4"
                    sx={{ fontWeight: 800 }}
                >
                    Add application
                </Typography>

                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Keep track of a new job opportunity.
                </Typography>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2.5, sm: 4 },
                    borderRadius: 3,
                    border: '1px solid #e5e7eb',
                }}
            >
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: '1fr 1fr',
                            },
                            gap: 2,
                        }}
                    >
                        <TextField
                            label="Company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Job title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Job URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            fullWidth
                            placeholder="https://..."
                        />

                        <TextField
                            select
                            label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                            fullWidth
                        >
                            {statuses.map(([value, label]) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Date applied"
                            type="date"
                            value={date_applied}
                            onChange={(e) => setDateApplied(e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            label="Interview date"
                            type="date"
                            value={interview_date}
                            onChange={(e) => setInterviewDate(e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            label="Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            multiline
                            rows={4}
                            fullWidth
                            sx={{ gridColumn: { sm: '1 / -1' } }}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 1.5,
                            mt: 3,
                            flexDirection: { xs: 'column-reverse', sm: 'row' },
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/jobs')}
                            sx={{ px: 3 }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{
                                px: 4,
                                py: 1.2,
                                background: '#4f46e5',
                                fontWeight: 700,
                                '&:hover': {
                                    background: '#4338ca',
                                },
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={23} color="inherit" />
                            ) : (
                                'Add application'
                            )}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
}

export default AddJob