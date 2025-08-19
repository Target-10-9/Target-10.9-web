import { Navigate } from 'react-router-dom';

export const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/auth" replace />;
    return children;
};
