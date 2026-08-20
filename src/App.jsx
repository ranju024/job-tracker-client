import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import AddJob from './pages/AddJob'
import EditJob from './pages/EditJob'

import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'


function AppContent() {
    const location = useLocation()

    const isAuthPage =
        location.pathname === '/login' ||
        location.pathname === '/register'

    return (
        <>
            {!isAuthPage && <Navbar />}

            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/jobs"
                    element={
                        <ProtectedRoute>
                            <Jobs />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/jobs/add"
                    element={
                        <ProtectedRoute>
                            <AddJob />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/jobs/edit/:id"
                    element={
                        <ProtectedRoute>
                            <EditJob />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </>
    )
}


function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
}

export default App