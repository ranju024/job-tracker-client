import { Navigate, useLocation } from 'react-router-dom'


function ProtectedRoute({ children }) {
    const token = localStorage.getItem('access')
    const location = useLocation()

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        )
    }

    return children
}

export default ProtectedRoute