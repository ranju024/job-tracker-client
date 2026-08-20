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
    IconButton,
    Divider,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import AddIcon from '@mui/icons-material/Add'

const interviewTypes = [
    ['phone', 'Phone'],
    ['video', 'Video'],
    ['onsite', 'On-site'],
    ['technical', 'Technical'],
    ['behavioral', 'Behavioral'],
    ['final', 'Final'],
    ['other', 'Other'],
]


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

    const [interviews, setInterviews] = useState([])
    const [showInterviewForm, setShowInterviewForm] = useState(false)
    const [interviewType, setInterviewType] = useState('video')
    const [scheduledAt, setScheduledAt] = useState('')
    const [meetingLink, setMeetingLink] = useState('')
    const [interviewLocation, setInterviewLocation] = useState('')
    const [interviewSaving, setInterviewSaving] = useState(false)
    const [interviewError, setInterviewError] = useState('')

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const interviewEligibleStatuses = ['screening', 'interviewing', 'offered']
    const canScheduleInterview = interviewEligibleStatuses.includes(status)

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
                setInterviews(job.interviews || [])
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
            })

            navigate('/jobs')
        } catch (error) {
            setError('Could not update the application.')
        } finally {
            setSaving(false)
        }
    }

    const handleAddInterview = async (e) => {
        e.preventDefault()

        setInterviewError('')

        if (!scheduledAt) {
            setInterviewError('Please pick a date and time.')
            return
        }

        setInterviewSaving(true)

        try {
            const response = await api.post('/api/interviews/', {
                application: id,
                interview_type: interviewType,
                scheduled_at: new Date(scheduledAt).toISOString(),
                meeting_link: meetingLink || '',
                location: interviewLocation || '',
            })

            setInterviews((prev) => [...prev, response.data])
            setShowInterviewForm(false)
            setInterviewType('video')
            setScheduledAt('')
            setMeetingLink('')
            setInterviewLocation('')
        } catch (error) {
            setInterviewError('Could not schedule the interview.')
        } finally {
            setInterviewSaving(false)
        }
    }

    const handleDeleteInterview = async (interviewId) => {
        try {
            await api.delete(`/api/interviews/${interviewId}/`)
            setInterviews((prev) =>
                prev.filter((interview) => interview.id !== interviewId)
            )
        } catch (error) {
            setInterviewError('Could not remove the interview.')
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

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2.5, sm: 4 },
                    borderRadius: 3,
                    border: '1px solid #e5e7eb',
                    mt: 3,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 750 }}>
                        Interviews
                    </Typography>

                    {canScheduleInterview && !showInterviewForm && (
                        <Button
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => setShowInterviewForm(true)}
                            sx={{ fontWeight: 700 }}
                        >
                            Schedule interview
                        </Button>
                    )}
                </Box>

                {!canScheduleInterview && (
                    <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{ mb: 2 }}
                    >
                        Interviews can be scheduled once the status is
                        Screening, Interviewing, or Offered.
                    </Typography>
                )}

                {interviewError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {interviewError}
                    </Alert>
                )}

                {interviews.length === 0 && !showInterviewForm && (
                    <Typography color="text.secondary" variant="body2">
                        No interviews scheduled yet.
                    </Typography>
                )}

                {interviews.length > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                            mb: showInterviewForm ? 3 : 0,
                        }}
                    >
                        {interviews.map((interview) => (
                            <Box
                                key={interview.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    p: 1.5,
                                    borderRadius: 2,
                                    background: '#f8fafc',
                                }}
                            >
                                <Box>
                                    <Typography
                                        sx={{ fontWeight: 700 }}
                                        variant="body2"
                                    >
                                        {interviewTypes.find(
                                            ([value]) =>
                                                value ===
                                                interview.interview_type
                                        )?.[1] || interview.interview_type}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {new Date(
                                            interview.scheduled_at
                                        ).toLocaleString(undefined, {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })}
                                        {interview.location
                                            ? ` · ${interview.location}`
                                            : ''}
                                    </Typography>
                                </Box>

                                <IconButton
                                    size="small"
                                    onClick={() =>
                                        handleDeleteInterview(interview.id)
                                    }
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                )}

                {showInterviewForm && (
                    <Box>
                        <Divider sx={{ mb: 2 }} />

                        <Box
                            component="form"
                            onSubmit={handleAddInterview}
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
                                select
                                label="Interview type"
                                value={interviewType}
                                onChange={(e) =>
                                    setInterviewType(e.target.value)
                                }
                                fullWidth
                            >
                                {interviewTypes.map(([value, label]) => (
                                    <MenuItem key={value} value={value}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Date & time"
                                type="datetime-local"
                                value={scheduledAt}
                                onChange={(e) =>
                                    setScheduledAt(e.target.value)
                                }
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                            />

                            <TextField
                                label="Meeting link"
                                value={meetingLink}
                                onChange={(e) =>
                                    setMeetingLink(e.target.value)
                                }
                                fullWidth
                                placeholder="https://..."
                            />

                            <TextField
                                label="Location"
                                value={interviewLocation}
                                onChange={(e) =>
                                    setInterviewLocation(e.target.value)
                                }
                                fullWidth
                            />

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 1.5,
                                    gridColumn: { sm: '1 / -1' },
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setShowInterviewForm(false)
                                        setInterviewError('')
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={interviewSaving}
                                    sx={{
                                        background: '#4f46e5',
                                        fontWeight: 700,
                                        '&:hover': {
                                            background: '#4338ca',
                                        },
                                    }}
                                >
                                    {interviewSaving ? (
                                        <CircularProgress
                                            size={20}
                                            color="inherit"
                                        />
                                    ) : (
                                        'Save interview'
                                    )}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Container>
    )
}

export default EditJob