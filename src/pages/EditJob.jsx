import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

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


function EditJob() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [company, setCompany] = useState('')
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [status, setStatus] = useState('')
    const [notes, setNotes] = useState('')
    const [date_applied, setDateApplied] = useState('')
    const [interview_date, setInterviewDate] = useState('')

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/api/jobs/${id}/`)
                const job = response.data

                setCompany(job.company || '')
                setTitle(job.title || '')
                setUrl(job.url || '')
                setStatus(job.status || 'applied')
                setNotes(job.notes || '')
                setDateApplied(job.date_applied || '')
                setInterviewDate(job.interview_date || '')
            } catch (error) {
                setError('Could not load this application.')
            } finally {
                setLoading(false)
            }
        }

        fetchJob()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')
        setSaving(true)

        try {
            await api.patch(`/api/jobs/${id}/`, {
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
            setError('Could not update the application.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Edit application
                </Typography>

                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Update your application details.
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
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
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
                            {saving ? (
                                <CircularProgress size={23} color="inherit" />
                            ) : (
                                'Save changes'
                            )}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
}

export default EditJob