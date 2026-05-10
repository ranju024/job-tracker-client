import { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Container, TextField, Typography, Paper } from '@mui/material'


function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post('/api/accounts/login/', {
                username,
                password
            })
            localStorage.setItem('access', response.data.access)
            localStorage.setItem('refresh', response.data.refresh)
            navigate('/dashboard')
        } catch (error) {
            alert('Invalid credentials')
        }
    }

    return (
    <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                />
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2 }}
                >
                    Login
                </Button>
                <Typography align="center" sx={{ mt: 2 }}>
                    Don't have an account? <a href="/register">Register</a>
                </Typography>
            </Box>
        </Paper>
    </Container>
)
}

export default Login