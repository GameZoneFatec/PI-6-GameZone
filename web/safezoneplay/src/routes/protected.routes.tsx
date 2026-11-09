import useAuth from '@hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
  const { userData, userLoading } = useAuth();

  if (userLoading) {
    return null;
  }

  if (!userData) {
    return <Navigate to='/start/login' replace />;
  }

  // DESCOMENTAR CASO QUEIRA TRAVAR E FORÇAR A VERIFICAÇÃO DE EMAIL DO USUÁRIO
  if (userData.email_verified === false) {
    return <Navigate to='/verify-email' replace />;
  }

  return <Outlet />;
};

export { ProtectedRoutes };
