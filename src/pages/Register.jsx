import { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Container, TextField, Typography, Paper } from '@mui/material'


function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [bio, setBio] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post('/api/accounts/register/', {
                username,
                email,
                password,
                password2,
                bio
            })
            navigate('/login')
        } catch (error) {
            alert('Registration failed. Please check your details.')
        }
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Register
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
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Add Bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        margin="normal"
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ mt: 2 }}
                    >
                        Register
                    </Button>
                    <Typography align="center" sx={{ mt: 2 }}>
                        Already have an account? <a href="/login">Login</a>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    )
}

export default Register