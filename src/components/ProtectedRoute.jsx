import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('access')
    console.log('ProtectedRoute running, token:', token)
    
    if (!token) {
        return <Navigate to="/login" />  // redirect to login Page
    }
    
    return children
}

export default ProtectedRoute