import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import ProtectedRoute from './components/ProtectedRoute'
import AddJob from './pages/AddJob'
import EditJob from './pages/EditJob'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        } />
        <Route path="/jobs" element={
            <ProtectedRoute>
                <Jobs />
            </ProtectedRoute>
        } />
        <Route path="/jobs/add" element={
            <ProtectedRoute>
                <AddJob />
            </ProtectedRoute>
        } />
        <Route path="/jobs/edit/:id" element={
            <ProtectedRoute>
                <EditJob />
            </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App