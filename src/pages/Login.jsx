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


function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')
        setLoading(true)

        try {
            const response = await api.post('/api/accounts/login/', {
                username,
                password,
            })

            localStorage.setItem('access', response.data.access)
            localStorage.setItem('refresh', response.data.refresh)

            navigate('/dashboard')
        } catch (error) {
            setError('Invalid username or password.')
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
                        maxWidth: 440,
                        mx: 'auto',
                        p: { xs: 3, sm: 5 },
                        border: '1px solid #e5e7eb',
                        borderRadius: 4,
                        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
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
                            sx={{ fontWeight: 700, color: '#172033' }}
                        >
                            Welcome back
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Sign in to manage your job applications.
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
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            autoComplete="current-password"
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
                                'Sign in'
                            )}
                        </Button>

                        <Typography
                            align="center"
                            sx={{ mt: 3, color: '#6b7280' }}
                        >
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                style={{
                                    color: '#4f46e5',
                                    fontWeight: 700,
                                }}
                            >
                                Create one
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}

export default Login