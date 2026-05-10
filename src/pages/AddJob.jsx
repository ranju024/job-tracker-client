import { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Container, TextField, Typography, Paper, MenuItem } from '@mui/material'

//company
// title
// url
// status
// notes
// date_applied
// interview_date

function AddJob() {
    const [company, setCompany] = useState('')
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [status, setStatus] = useState('')
    const [notes, setNotes] = useState('')
    const today = new Date().toISOString().split('T')[0]
    const [date_applied, setDateApplied] = useState(today)
    const [interview_date, setInterviewDate] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post('/api/jobs/', {
                company,
                title,
                url: url || null,
                status,
                notes: notes || null,
                date_applied: date_applied || UNSAFE_getTurboStreamSingleFetchDataStrategy,
                interview_date: interview_date || null
            })
            navigate('/jobs')
        } catch (error) {
            alert('Addition failed. Please try again later.')
        }
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>Add Job</Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField fullWidth label="Company" value={company} onChange={(e) => setCompany(e.target.value)} margin="normal" required />
                    <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} margin="normal" required />
                    <TextField fullWidth label="URL" value={url} onChange={(e) => setUrl(e.target.value)} margin="normal" />
                    <TextField
                        fullWidth select label="Status" value={status}
                        onChange={(e) => setStatus(e.target.value)} margin="normal" required
                    >
                        {['applied','screening','interviewing','offered','rejected','ghosted','withdrawn'].map((s) => (
                            <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
                        ))}
                    </TextField>
                    <TextField fullWidth label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} margin="normal" multiline rows={3} />
                    <TextField fullWidth label="Date Applied" type="date" value={date_applied} onChange={(e) => setDateApplied(e.target.value)} margin="normal" InputLabelProps={{ shrink: true }} />
                    <TextField fullWidth label="Interview Date" type="date" value={interview_date} onChange={(e) => setInterviewDate(e.target.value)} margin="normal" InputLabelProps={{ shrink: true }} />
                    <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>Add Job</Button>
                </Box>
            </Paper>
        </Container>
    )
}

export default AddJob