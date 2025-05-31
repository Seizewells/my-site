import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkAdminStatus } from '../../lib/supabase';
import LoadingSpinner from '../shared/LoadingSpinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const isAdminUser = await checkAdminStatus();
      setIsAdmin(isAdminUser);
    };
    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;