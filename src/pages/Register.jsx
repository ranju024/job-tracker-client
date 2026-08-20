import { useState } from 'react'
import api from '../services/api'
import { Link, useNavigate } from 'react-router-dom'

import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Alert,
    CircularProgress,
} from '@mui/material'


function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [bio, setBio] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')

        if (password !== password2) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)

        try {
            await api.post('/api/accounts/register/', {
                username,
                email,
                password,
                password2,
                bio,
            })

            navigate('/login')
        } catch (error) {
            const message =
                error.response?.data?.detail ||
                'Registration failed. Please check your details.'

            setError(
                typeof message === 'string'
                    ? message
                    : 'Registration failed. Please check your details.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                py: 4,
                background:
                    'linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #eef2ff 100%)',
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={0}
                    sx={{
                        maxWidth: 480,
                        mx: 'auto',
                        p: { xs: 3, sm: 5 },
                        border: '1px solid #e5e7eb',
                        borderRadius: 4,
                        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                color: '#4f46e5',
                                mb: 1,
                            }}
                        >
                            JobTracker
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 700 }}
                        >
                            Create your account
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Start organizing your job search.
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            margin="normal"
                            required
                            autoComplete="username"
                        />

                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                            autoComplete="email"
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            autoComplete="new-password"
                        />

                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            margin="normal"
                            required
                            autoComplete="new-password"
                        />

                        <TextField
                            fullWidth
                            label="Bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            margin="normal"
                            multiline
                            rows={2}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 3,
                                py: 1.4,
                                borderRadius: 2,
                                background: '#4f46e5',
                                fontWeight: 700,
                                '&:hover': {
                                    background: '#4338ca',
                                },
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Create account'
                            )}
                        </Button>

                        <Typography
                            align="center"
                            sx={{ mt: 3, color: '#6b7280' }}
                        >
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                style={{
                                    color: '#4f46e5',
                                    fontWeight: 700,
                                }}
                            >
                                Sign in
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}

export default Register