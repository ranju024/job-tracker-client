import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
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
    Chip,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

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

const workTypes = [
    ['', 'Not specified'],
    ['remote', 'Remote'],
    ['hybrid', 'Hybrid'],
    ['onsite', 'On-site'],
]

const workTypeLabels = Object.fromEntries(workTypes)

const statusStyles = {
    applied: { color: '#2563eb', background: '#eff6ff' },
    screening: { color: '#7c3aed', background: '#f5f3ff' },
    interviewing: { color: '#0891b2', background: '#ecfeff' },
    offered: { color: '#15803d', background: '#f0fdf4' },
    rejected: { color: '#dc2626', background: '#fef2f2' },
    ghosted: { color: '#6b7280', background: '#f3f4f6' },
    withdrawn: { color: '#c2410c', background: '#fff7ed' },
}


function EditJob() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const [isEditing, setIsEditing] = useState(
        searchParams.get('edit') === 'true'
    )

    const [company, setCompany] = useState('')
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [location, setLocation] = useState('')
    const [workType, setWorkType] = useState('')
    const [salaryMin, setSalaryMin] = useState('')
    const [salaryMax, setSalaryMax] = useState('')
    const [source, setSource] = useState('')
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
                setLocation(job.location || '')
                setWorkType(job.work_type || '')
                setSalaryMin(job.salary_min ?? '')
                setSalaryMax(job.salary_max ?? '')
                setSource(job.source || '')
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

        if (
            salaryMin &&
            salaryMax &&
            Number(salaryMin) > Number(salaryMax)
        ) {
            setError('Minimum salary cannot be greater than maximum salary.')
            return
        }

        setSaving(true)

        try {
            await api.patch(`/api/jobs/${id}/`, {
                company,
                title,
                url: url || null,
                location: location || '',
                work_type: workType || '',
                salary_min: salaryMin || null,
                salary_max: salaryMax || null,
                source: source || '',
                status,
                notes: notes || null,
                date_applied,
            })

            setIsEditing(false)
            setSearchParams({})
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
            <Box
                sx={{
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{
                            mt: 0.5,
                            border: '1px solid #e5e7eb',
                            borderRadius: 2,
                        }}
                        aria-label="Go back"
                    >
                        <ArrowBackIcon />
                    </IconButton>

                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>
                            {isEditing ? 'Edit application' : 'Application details'}
                        </Typography>

                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            {isEditing
                                ? 'Update your application details.'
                                : "Here's what you've saved for this application."}
                        </Typography>
                    </Box>
                </Box>

                {!isEditing && (
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => {
                            setIsEditing(true)
                            setSearchParams({ edit: 'true' })
                        }}
                        sx={{ fontWeight: 700 }}
                    >
                        Edit
                    </Button>
                )}
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

                {!isEditing ? (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: '1fr 1fr',
                            },
                            gap: 2.5,
                        }}
                    >
                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Company
                            </Typography>
                            <Typography sx={{ fontWeight: 600, mt: 0.3 }}>
                                {company}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Job title
                            </Typography>
                            <Typography sx={{ fontWeight: 600, mt: 0.3 }}>
                                {title}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Job URL
                            </Typography>
                            {url ? (
                                <Typography
                                    component="a"
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        fontWeight: 600,
                                        mt: 0.3,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        color: '#4f46e5',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Open posting
                                    <OpenInNewIcon
                                        sx={{ fontSize: 16 }}
                                    />
                                </Typography>
                            ) : (
                                <Typography
                                    sx={{ fontWeight: 600, mt: 0.3 }}
                                    color="text.secondary"
                                >
                                    Not provided
                                </Typography>
                            )}
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Status
                            </Typography>
                            <Chip
                                label={
                                    statuses.find(
                                        ([value]) => value === status
                                    )?.[1] || status
                                }
                                size="small"
                                sx={{
                                    mt: 0.5,
                                    fontWeight: 700,
                                    color:
                                        statusStyles[status]?.color ||
                                        '#374151',
                                    background:
                                        statusStyles[status]?.background ||
                                        '#f3f4f6',
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Date applied
                            </Typography>
                            <Typography sx={{ fontWeight: 600, mt: 0.3 }}>
                                {date_applied}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Location
                            </Typography>
                            <Typography
                                sx={{ fontWeight: 600, mt: 0.3 }}
                                color={
                                    location ? 'inherit' : 'text.secondary'
                                }
                            >
                                {location || 'Not provided'}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Work type
                            </Typography>
                            <Typography
                                sx={{ fontWeight: 600, mt: 0.3 }}
                                color={
                                    workType ? 'inherit' : 'text.secondary'
                                }
                            >
                                {workTypeLabels[workType] || 'Not specified'}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Salary range
                            </Typography>
                            <Typography
                                sx={{ fontWeight: 600, mt: 0.3 }}
                                color={
                                    salaryMin || salaryMax
                                        ? 'inherit'
                                        : 'text.secondary'
                                }
                            >
                                {salaryMin || salaryMax
                                    ? `${salaryMin || '?'} – ${
                                          salaryMax || '?'
                                      }`
                                    : 'Not provided'}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Source
                            </Typography>
                            <Typography
                                sx={{ fontWeight: 600, mt: 0.3 }}
                                color={source ? 'inherit' : 'text.secondary'}
                            >
                                {source || 'Not provided'}
                            </Typography>
                        </Box>

                        <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Notes
                            </Typography>
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    mt: 0.3,
                                    whiteSpace: 'pre-wrap',
                                }}
                                color={notes ? 'inherit' : 'text.secondary'}
                            >
                                {notes || 'No notes added.'}
                            </Typography>
                        </Box>
                    </Box>
                ) : (
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
                            label="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            fullWidth
                        />

                        <TextField
                            select
                            label="Work type"
                            value={workType}
                            onChange={(e) => setWorkType(e.target.value)}
                            fullWidth
                        >
                            {workTypes.map(([value, label]) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Source"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
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
                            label="Minimum salary"
                            type="number"
                            value={salaryMin}
                            onChange={(e) => setSalaryMin(e.target.value)}
                            fullWidth
                            inputProps={{ min: 0, step: '0.01' }}
                        />

                        <TextField
                            label="Maximum salary"
                            type="number"
                            value={salaryMax}
                            onChange={(e) => setSalaryMax(e.target.value)}
                            fullWidth
                            inputProps={{ min: 0, step: '0.01' }}
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
                            onClick={() => {
                                setIsEditing(false)
                                setSearchParams({})
                            }}
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
                )}
            </Paper>

            {(canScheduleInterview || interviews.length > 0) && (
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

                        {isEditing && canScheduleInterview && !showInterviewForm && (
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

                                {isEditing && (
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            handleDeleteInterview(
                                                interview.id
                                            )
                                        }
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                )}
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
            )}
        </Container>
    )
}

export default EditJob