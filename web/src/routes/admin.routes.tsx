import useAuth from '@hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Só deixa passar usuários com role ADMIN.
 * É uma proteção de interface: a segurança real está na API (/admin exige token + ADMIN).
 */
const AdminRoutes = () => {
  const { userData, userLoading } = useAuth();

  if (userLoading) return null;
  if (!userData) return <Navigate to='/start/login' replace />;
  if (userData.role !== 'ADMIN') return <Navigate to='/home' replace />;

  return <Outlet />;
};

export { AdminRoutes };
