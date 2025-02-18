import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';

const SuperAdminRoute = ({ children }) => {
    const { authUser } = useAuthContext();

    if (!authUser?.superAdmin) {
        return <Navigate to="/app" replace />;
    }

    return children;
};

export default SuperAdminRoute; 