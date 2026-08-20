import { useState } from 'react'
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'


function Navbar() {
    const navigate = useNavigate()
    const [drawerOpen, setDrawerOpen] = useState(false)

    const handleLogout = async () => {
        try {
            await api.post('/api/accounts/logout/', {
                refresh: localStorage.getItem('refresh'),
            })
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            navigate('/login')
        }
    }

    const closeDrawer = () => {
        setDrawerOpen(false)
    }

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background: '#ffffff',
                    color: '#172033',
                    borderBottom: '1px solid #e5e7eb',
                }}
            >
                <Toolbar
                    sx={{
                        maxWidth: '1200px',
                        width: '100%',
                        margin: '0 auto',
                        px: { xs: 2, sm: 3 },
                        minHeight: '68px !important',
                    }}
                >
                    <Typography
                        component={Link}
                        to="/dashboard"
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: '-0.5px',
                            color: '#4f46e5',
                            flexGrow: 1,
                        }}
                    >
                        JobTracker
                    </Typography>

                    {/* Desktop navigation */}
                    <Box
                        sx={{
                            display: { xs: 'none', sm: 'flex' },
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Button
                            component={Link}
                            to="/dashboard"
                            sx={{
                                color: '#374151',
                                fontWeight: 600,
                                px: 2,
                            }}
                        >
                            Dashboard
                        </Button>

                        <Button
                            component={Link}
                            to="/jobs"
                            sx={{
                                color: '#374151',
                                fontWeight: 600,
                                px: 2,
                            }}
                        >
                            Applications
                        </Button>

                        <Button
                            onClick={handleLogout}
                            variant="outlined"
                            sx={{
                                ml: 1,
                                borderColor: '#e5e7eb',
                                color: '#374151',
                                fontWeight: 600,
                                '&:hover': {
                                    borderColor: '#d1d5db',
                                    background: '#f9fafb',
                                },
                            }}
                        >
                            Logout
                        </Button>
                    </Box>

                    {/* Mobile menu */}
                    <IconButton
                        onClick={() => setDrawerOpen(true)}
                        sx={{
                            display: { xs: 'flex', sm: 'none' },
                            color: '#374151',
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={closeDrawer}
            >
                <Box sx={{ width: 260 }} role="presentation">
                    <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 800, color: '#4f46e5' }}
                        >
                            JobTracker
                        </Typography>
                    </Box>

                    <List>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                to="/dashboard"
                                onClick={closeDrawer}
                            >
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                to="/jobs"
                                onClick={closeDrawer}
                            >
                                <ListItemText primary="Applications" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    closeDrawer()
                                    handleLogout()
                                }}
                            >
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    )
}

export default Navbar