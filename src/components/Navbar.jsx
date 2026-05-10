import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Navbar() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await api.post('/api/accounts/logout/', {
                refresh: localStorage.getItem('refresh')
            })
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            navigate('/login')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Job Tracker
                </Typography>
                <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
                <Button color="inherit" component={Link} to="/jobs">Jobs</Button>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar